// Browser side of Paddle Billing. Paddle.js is loaded only when a checkout is about to open, so
// visitors who never subscribe don't download it. The client-side token and sandbox/live mode come
// from the server (/api/billing/checkout or /api/billing/config), so they always match the
// environment the transaction was created in; PADDLE_TEST_MODE is the single switch.
type PaddleJs = {
  Environment: { set(environment: "sandbox"): void };
  Initialize(options: { token: string; eventCallback?: (event: { name?: string }) => void }): void;
  Checkout: { open(options: Record<string, unknown>): void };
};
declare global { interface Window { Paddle?: PaddleJs } }

const listeners = new Set<(name: string) => void>();
let loading: Promise<PaddleJs> | undefined;

function loadPaddle(token: string, sandbox: boolean): Promise<PaddleJs> {
  loading ??= new Promise<PaddleJs>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;
    script.onload = () => {
      const paddle = window.Paddle;
      if (!paddle) { reject(new Error("Paddle.js did not initialise")); return; }
      if (sandbox) paddle.Environment.set("sandbox");
      paddle.Initialize({ token, eventCallback: (event) => { for (const listener of listeners) listener(event.name ?? ""); } });
      resolve(paddle);
    };
    script.onerror = () => { loading = undefined; script.remove(); reject(new Error("Paddle.js failed to load")); };
    document.head.appendChild(script);
  });
  return loading;
}

/** e.g. "checkout.closed", "checkout.completed". Returns an unsubscribe function. */
export function onPaddleEvent(listener: (name: string) => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

/** Opens Paddle's overlay checkout for a transaction created by /api/billing/checkout. */
export async function openPaddleCheckout({ transactionId, successUrl, locale, clientToken, sandbox }: {
  transactionId: string; successUrl: string; locale: string; clientToken: string; sandbox: boolean;
}) {
  const paddle = await loadPaddle(clientToken, sandbox);
  paddle.Checkout.open({
    transactionId,
    settings: {
      displayMode: "overlay",
      theme: document.documentElement.dataset.theme === "dark" ? "dark" : "light",
      locale,
      successUrl,
    },
  });
}
