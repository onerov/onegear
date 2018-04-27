/**
 * Çalışan uygulama instance için static context bilgisini almak için kullanılır.
 */
class AppContext {

    public static contextUser: UserInfo;

    public static reset(clearCache, logout): void {
    }

    public static logout(): void {
        //INFO: bir sonraki ziyaretinde sadece şifre ile giriş yapabilmesi için
        //      window.localStorage.removeItem("USER_INFO") silinmiyor
        var cname = '.ASPXAUTH', cvalue = '', exMins = 0;
        var d = new Date();
        d.setTime(d.getTime() + (exMins * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    /**
     * .ASPXAUTH isimli cookie varsa true diğer durumda false değer verir.
     * @returns
     */
    public static authCookieExists(): boolean {
        var isExsits: boolean = false;
        try {
            var cookieName = '.ASPXAUTH';
            var cookies = document.cookie.split(';');
            for (let i: number = 0; i < cookies.length; i++) {
                var cookie = cookies[i].split('=');
                if (cookie[0].trim() == cookieName) {
                    isExsits = true;
                    break;
                }
            }
        }
        catch (e) {
            console.error(e);
        }
        return isExsits;
    }

    public static loadUser(): void {
        var data = window.localStorage.getItem("USER_INFO");
        if (Utils.hasValue(data)) {
            AppContext.contextUser = JSON.parse(data);
        }
    }

    public static register(user: UserInfo): void {
        AppContext.contextUser = user;
        window.localStorage.setItem("USER_INFO", JSON.stringify(user));

        //TODO: Geçici olarak eklendi, viewEngine güncellenince silinecek.
        AppContext.getConfig().authTicket = user.AuthTicket;
    }

    public static changeLanguage(cultureCode) {
        AppContext.contextUser.CultureCode = cultureCode.replaceAll("'", "");
        this.register(AppContext.contextUser);
    }

    private static _config: AppConfig;
    public static getConfig(): AppConfig {
        if (AppContext._config == null) {
            AppContext._config = new AppConfig();
            if (AppContext.contextUser == null)
                AppContext.loadUser();
            if (AppContext.contextUser != null)
                AppContext._config.authTicket = AppContext.contextUser.AuthTicket;
        }
        return AppContext._config;
    }

    private static _culture: BaseCulture;
    public static getCulture(): BaseCulture {
        if (AppContext._culture == null) {
            if (AppContext.contextUser == null)
                AppContext.loadUser();
            if (AppContext.contextUser != null) {
                var cultureCode = AppContext.contextUser.CultureCode;
                if (Utils.hasValue(cultureCode)) {
                    cultureCode = cultureCode.split('-')[0].toUpperCase();
                }
            }
            if (Utils.isEmpty(cultureCode)) {
                cultureCode = "EN";//TODO:Parameter
            }
            var instance = Utils.createIstance("Culture" + cultureCode);
            if (instance) {
                AppContext._culture = instance;
            }
            else {
                return <BaseCulture>{};
            }
        }
        return AppContext._culture;
    }

    private static _uiHelper: UIHelper;
    public static getUIHelper(): UIHelper {
        if (AppContext._uiHelper == null) {
            var instance = Utils.createIstance(AppContext.getConfig().UIHelperType);
            if (instance) {
                AppContext._uiHelper = instance;
            }
            else {
                return <UIHelper>{};
            }
        }
        return AppContext._uiHelper;
    }

    private static _apiHelper: ApiHelper;
    public static getApiHelper(): ApiHelper {
        if (AppContext._apiHelper == null) {
            var instance = Utils.createIstance(AppContext.getConfig().apiHelperType);
            if (instance) {
                AppContext._apiHelper = instance;
            }
            else {
                return <ApiHelper>{};
            }
        }
        return AppContext._apiHelper;
    }
}

//class App {
//    /*TOOD: private*/
//    constructor() {
//    }

//    private static _app: App;
//    public static createInstance() {
//        if (App._app == null)
//            App._app = new App();
//        return App._app;
//    }

//    public context: AppContext;
//    public config: AppConfig;
//}
