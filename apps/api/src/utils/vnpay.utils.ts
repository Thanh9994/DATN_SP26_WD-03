import crypto from "crypto";
import qs from "qs";

export function sortObject(obj: any) {
  const sorted: any = {};
  const keys = Object.keys(obj).sort();

  for (const key of keys) {
    sorted[key] = obj[key];
  }

  return sorted;
}

export function createSecureHash(data: any, secret: string) {
  const sorted = sortObject(data);

  const signData = qs.stringify(sorted, { encode: false });

  const hmac = crypto.createHmac("sha512", secret);

  return hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
}

export function verifyVnpay(query: any, secret: string) {
  const vnp_Params = { ...query };

  const secureHash = vnp_Params.vnp_SecureHash;

  delete vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHashType;

  const hash = createSecureHash(vnp_Params, secret);

  return secureHash === hash;
}
