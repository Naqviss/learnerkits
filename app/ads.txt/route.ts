import {adsensePublisherId} from "@/lib/adsense/config";
export function GET(){const publisher=adsensePublisherId();const body=publisher?`google.com, ${publisher}, DIRECT, f08c47fec0942fa0\n`:`# Set ADSENSE_PUBLISHER_ID to publish your authorized seller record.\n`;return new Response(body,{headers:{"content-type":"text/plain; charset=utf-8","cache-control":"public, max-age=3600"}});}
