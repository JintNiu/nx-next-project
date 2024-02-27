export const getCookie = (key: string, cookies?: string) => {
  var value = "";
  if (!cookies) {
    if (typeof window !== "undefined") {
      cookies = document.cookie;
    } else {
      return value;
    }
  }
  var cookieArr: string[] = cookies.split("; ");
  for (var i = 0, cookie = "", index = 0; i < cookieArr.length; i++) {
    cookie = cookieArr[i];
    index = cookie.indexOf("=");
    if (cookie.substr(0, index) === key) {
      value = cookie.substr(index + 1);
    }
  }
  return value;
};

export const setCookie = (
  key: string,
  value: string,
  timeout?: Date,
  path?: string,
  domain?: string,
  secure?: boolean
) => {
  if (!timeout) {
    timeout = new Date(new Date().getTime() + 3 * 360 * 24 * 60 * 60 * 1000);
  }
  if (!path) {
    path = "/";
  }
  if (typeof window === "undefined") {
    return;
  }
  try {
    if (!domain) {
      domain = location.hostname || ".ctrip.com";
    }
    if (isAnyType(value, "Object") || isAnyType(value, "Array")) {
      value = JSON.stringify(value);
    }
    document.cookie =
      key +
      "=" +
      encodeURIComponent(value) +
      (timeout ? "; expires=" + timeout.toUTCString() : "") +
      (path ? "; path=" + path : "") +
      (domain ? "; domain=" + domain : "") +
      (secure ? "; secure" : "");
  } catch (e) {}
};

const isAnyType = (obj: any, type: string) => {
  var _objStr = Object.prototype.toString.call(obj) || "";
  var objType = _objStr.slice(8, -1);
  if (!type) {
    return objType;
  }
  return objType.toLowerCase() === type.toLowerCase();
};
