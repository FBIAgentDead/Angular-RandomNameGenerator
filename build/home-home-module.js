(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["home-home-module"],{

/***/ "./node_modules/angular-web-storage/fesm2015/angular-web-storage.js":
/*!**************************************************************************!*\
  !*** ./node_modules/angular-web-storage/fesm2015/angular-web-storage.js ***!
  \**************************************************************************/
/*! exports provided: AngularWebStorageModule, LocalStorage, LocalStorageService, SessionStorage, SessionStorageService, StorageService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AngularWebStorageModule", function() { return AngularWebStorageModule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LocalStorage", function() { return LocalStorage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LocalStorageService", function() { return LocalStorageService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SessionStorage", function() { return SessionStorage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SessionStorageService", function() { return SessionStorageService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StorageService", function() { return StorageService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");


/**
 * 判断是否在浏览器中渲染Angular应用
 * `decorator` 无法直接使用Angular `PLATFORM_ID` 标识
 * 这带来的好处是当服务端自行填充 Document 时也能很好的识别
 */
const isBrowser = typeof document === 'object' && !!document;
class StorageUtil {
    static get(storage, key) {
        if (storage == null) {
            return null;
        }
        const value = StorageUtil.parse(storage.getItem(key) || 'null') || null;
        if (value === null)
            return null;
        if (typeof value === 'object' &&
            typeof value._expired !== 'undefined' &&
            value._expired !== 0 &&
            +new Date() > value._expired) {
            StorageUtil.remove(storage, key);
            return null;
        }
        return value._value || null;
    }
    static set(storage, key, value, expiredAt = 0, expiredUnit = 't') {
        if (storage == null) {
            return;
        }
        storage.setItem(key, StorageUtil.stringify({
            _expired: StorageUtil.getExpired(expiredAt, expiredUnit),
            _value: value,
        }));
    }
    static remove(storage, key) {
        if (storage == null) {
            return;
        }
        storage.removeItem(key);
    }
    static key(storage, index) {
        return storage == null ? '' : storage.key(index);
    }
    static getExpired(val, unit) {
        if (val <= 0)
            return 0;
        const now = +new Date();
        switch (unit) {
            case 's': // 秒
                return now + 1000 * val;
            case 'm': // 分
                return now + 1000 * 60 * val;
            case 'h': // 时
                return now + 1000 * 60 * 60 * val;
            case 'd': // 天
                return now + 1000 * 60 * 60 * 24 * val;
            case 'w': // 周
                return now + 1000 * 60 * 60 * 24 * 7 * val;
            case 'y': // 年
                return now + 1000 * 60 * 60 * 24 * 365 * val;
            case 't': // 自定义
                return now + val;
        }
        return 0;
    }
    static stringify(value) {
        return JSON.stringify(value);
    }
    static parse(text) {
        try {
            return JSON.parse(text) || null;
        }
        catch (e) {
            return text;
        }
    }
}

const cache = {};
function WebStorage(storage, key, expiredAt = 0, expiredUnit = 'd') {
    return (target, propertyName) => {
        key = key || propertyName;
        Object.defineProperty(target, propertyName, {
            get: () => {
                return StorageUtil.get(storage, key);
            },
            set: (value) => {
                if (!cache[key]) {
                    const storedValue = StorageUtil.get(storage, key);
                    if (storedValue === null) {
                        StorageUtil.set(storage, key, value, expiredAt, expiredUnit);
                    }
                    cache[key] = true;
                    return;
                }
                StorageUtil.set(storage, key, value, expiredAt, expiredUnit);
            },
            enumerable: true,
            configurable: true,
        });
    };
}
/**
 * `localStorage` Decorator
 *
 * @param [expiredAt=0] Expiration time, 0 means forever
 * @param [expiredUnit='t'] Expiration time unit (default: custom [unit: ms])
 */
function LocalStorage(key, expiredAt = 0, expiredUnit = 't') {
    return WebStorage(isBrowser ? localStorage : null, key, expiredAt, expiredUnit);
}
/**
 * `sessionStorage` Decorator
 *
 * @param [expiredAt=0] Expiration time, 0 means forever
 * @param [expiredUnit='t'] Expiration time unit (default: custom [unit: ms])
 */
function SessionStorage(key, expiredAt = 0, expiredUnit = 't') {
    return WebStorage(isBrowser ? sessionStorage : null, key, expiredAt, expiredUnit);
}

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
class StorageService {
    constructor(storage) {
        this.storage = storage;
    }
    get(key) {
        return StorageUtil.get(this.storage, key);
    }
    set(key, value, expiredAt = 0, expiredUnit = 'd') {
        return StorageUtil.set(this.storage, key, value, expiredAt, expiredUnit);
    }
    /**
     * 删除指定key，如：
     * - `remove('key')` 删除 `key` 键
     * - `remove(/BMap_\w+/)` 批量删除所有 BMap_ 开头的键
     * @param key 键名或正则表达式
     */
    remove(key) {
        if (typeof key === 'string') {
            StorageUtil.remove(this.storage, key);
            return;
        }
        let index = 0;
        let next = StorageUtil.key(this.storage, index);
        const ls = [];
        while (next) {
            if (key.test(next))
                ls.push(next);
            next = StorageUtil.key(this.storage, ++index);
        }
        ls.forEach(v => StorageUtil.remove(this.storage, v));
    }
    clear() {
        this.storage.clear();
    }
}
let LocalStorageService = class LocalStorageService extends StorageService {
    constructor() {
        super(isBrowser ? localStorage : null);
    }
};
LocalStorageService.ngInjectableDef = Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["defineInjectable"])({ factory: function LocalStorageService_Factory() { return new LocalStorageService(); }, token: LocalStorageService, providedIn: "root" });
LocalStorageService = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({ providedIn: 'root' }),
    __metadata("design:paramtypes", [])
], LocalStorageService);
let SessionStorageService = class SessionStorageService extends StorageService {
    constructor() {
        super(isBrowser ? sessionStorage : null);
    }
};
SessionStorageService.ngInjectableDef = Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["defineInjectable"])({ factory: function SessionStorageService_Factory() { return new SessionStorageService(); }, token: SessionStorageService, providedIn: "root" });
SessionStorageService = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({ providedIn: 'root' }),
    __metadata("design:paramtypes", [])
], SessionStorageService);

var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let AngularWebStorageModule = class AngularWebStorageModule {
};
AngularWebStorageModule = __decorate$1([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])()
], AngularWebStorageModule);

/**
 * Generated bundle index. Do not edit.
 */


//# sourceMappingURL=angular-web-storage.js.map


/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/home/home.page.html":
/*!***************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/home/home.page.html ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<ion-header>\n  <ion-toolbar>\n    <ion-title>\n      Random name generator\n    </ion-title>\n  </ion-toolbar>\n</ion-header>\n\n<ion-content>\n  <ion-grid>\n    <ion-row>  \n      <div ng-app=\"myApp\" ng-controller=\"customersCtrl\"></div>\n      <ion-item>\n        <ion-label>Enter Name:</ion-label>\n        <ion-input [(ngModel)]=\"user\"></ion-input>\n      </ion-item>\n      <ion-button (click)=\"sendname()\" value=\"value\" color=\"success\">Submit</ion-button>\n    </ion-row>\n    <ion-row>\n      <ion-label>Names:</ion-label><br>\n    </ion-row>\n      <tr *ngFor=\"let name of names; let i = index\">\n        <ion-row>\n          <td>{{i+1+\".\"}} {{name}}</td>\n        </ion-row>\n      </tr>\n    <ion-row>\n      <ion-button (click)=\"pickrandom()\" color=\"success\">Pick Random name</ion-button><br>\n    </ion-row>\n  <a>{{this.pickedname}}</a>\n</ion-grid>\n</ion-content>\n"

/***/ }),

/***/ "./src/app/home/home.module.ts":
/*!*************************************!*\
  !*** ./src/app/home/home.module.ts ***!
  \*************************************/
/*! exports provided: HomePageModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomePageModule", function() { return HomePageModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm2015/common.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/fesm5.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm2015/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var angular_web_storage__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! angular-web-storage */ "./node_modules/angular-web-storage/fesm2015/angular-web-storage.js");
/* harmony import */ var _home_page__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./home.page */ "./src/app/home/home.page.ts");









let HomePageModule = class HomePageModule {
};
HomePageModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-home',
        template: __webpack_require__(/*! raw-loader!./home.page.html */ "./node_modules/raw-loader/index.js!./src/app/home/home.page.html"),
        styles: [__webpack_require__(/*! ./home.page.scss */ "./src/app/home/home.page.scss")]
    }),
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        imports: [
            angular_web_storage__WEBPACK_IMPORTED_MODULE_6__["AngularWebStorageModule"],
            _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"],
            _ionic_angular__WEBPACK_IMPORTED_MODULE_3__["IonicModule"],
            _angular_router__WEBPACK_IMPORTED_MODULE_5__["RouterModule"].forChild([
                {
                    path: '',
                    component: _home_page__WEBPACK_IMPORTED_MODULE_7__["HomePage"]
                }
            ])
        ],
        declarations: [_home_page__WEBPACK_IMPORTED_MODULE_7__["HomePage"]]
    })
], HomePageModule);



/***/ }),

/***/ "./src/app/home/home.page.scss":
/*!*************************************!*\
  !*** ./src/app/home/home.page.scss ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".Submit {\n  background-color: 0 !important;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvaG9tZS9DOlxcVXNlcnNcXHZtYW5lXFxPbmVEcml2ZVxcQnVyZWF1YmxhZFxcUmFuZG9tTmFtZSBHZW5lcmF0b3JcXHJhbmRvbU5hbWVHZW5lcmF0b3Ivc3JjXFxhcHBcXGhvbWVcXGhvbWUucGFnZS5zY3NzIiwic3JjL2FwcC9ob21lL2hvbWUucGFnZS5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksOEJBQUE7QUNDSiIsImZpbGUiOiJzcmMvYXBwL2hvbWUvaG9tZS5wYWdlLnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuU3VibWl0e1xuICAgIGJhY2tncm91bmQtY29sb3I6IHJlZCgkY29sb3I6ICMwMDAwMDApICFpbXBvcnRhbnQ7XG59XG4iLCIuU3VibWl0IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogMCAhaW1wb3J0YW50O1xufSJdfQ== */"

/***/ }),

/***/ "./src/app/home/home.page.ts":
/*!***********************************!*\
  !*** ./src/app/home/home.page.ts ***!
  \***********************************/
/*! exports provided: HomePage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomePage", function() { return HomePage; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var angular_web_storage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! angular-web-storage */ "./node_modules/angular-web-storage/fesm2015/angular-web-storage.js");



let HomePage = class HomePage {
    constructor(local) {
        this.local = local;
        //list of names stored somewhere
        this.names = this.local.get("names");
        this.user = "";
        //the currently picked name
        this.pickedname = "";
    }
    //sends the given value to a json/database/localstorage
    sendname() {
        console.log(this.user);
        console.log(this.names);
        if (this.names === null) {
            this.names = [];
        }
        //check if user ecxists
        if (this.names.includes(this.user)) {
            console.log("user already excists!");
            return;
        }
        //check if user is empty
        if (this.user === "") {
            return;
        }
        //simply push the new name to the local list
        this.names.push(this.user);
        this.local.clear();
        this.local.set("names", this.names);
    }
    //random number between min and max 
    random(min, max) {
        var random = Math.floor(Math.random() * (+max - +min)) + +min;
        return random;
    }
    //picks a random name to be chosen
    pickrandom() {
        this.pickedname = this.names[this.random(0, this.names.length)];
    }
};
HomePage.ctorParameters = () => [
    { type: angular_web_storage__WEBPACK_IMPORTED_MODULE_2__["LocalStorageService"] }
];
HomePage = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-home',
        template: __webpack_require__(/*! raw-loader!./home.page.html */ "./node_modules/raw-loader/index.js!./src/app/home/home.page.html"),
        styles: [__webpack_require__(/*! ./home.page.scss */ "./src/app/home/home.page.scss")]
    }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [angular_web_storage__WEBPACK_IMPORTED_MODULE_2__["LocalStorageService"]])
], HomePage);



/***/ })

}]);
//# sourceMappingURL=home-home-module.js.map