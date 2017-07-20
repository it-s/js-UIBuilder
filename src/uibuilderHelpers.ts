export default class UIBuilderHelpers {
  public static isDefined(v: any) {
    return v != undefined;
  }
  public static isObject(v: any) {
    return (this.isDefined(v) && typeof v == "object");
  }
  public static printf(str: string, scope: any) {
    let regex = /\{\{(\w+)\}\}/g;
    let instance: string = str;
    let from: string, to: string, m: RegExpExecArray | null;
    if (this.isObject(scope))
      while ((m = regex.exec(str)) !== null) {
        from = <string>m[0]; to = <string>scope[m[1]];
        this.isDefined(to) &&
          (instance = instance.replace(from, to));
      }
    else return str;
    return instance;
  }
}