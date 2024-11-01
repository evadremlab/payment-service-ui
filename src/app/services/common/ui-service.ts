import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';
import { ButtonState } from '../../shared/models/loader-state';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

declare var jQuery: any;
declare var $: any;
declare let jsPDF;

@Injectable()
export class UiService {

    constructor(private _location: Location, private router: Router) { }

    goBack() {
        this._location.back();
    }

    toTop() {
        $("html, body").animate({ scrollTop: 0 }, 500);
    }

    calcTime(d) {
        var nd = new Date(d);
        var day = nd.getDate()
        nd.setUTCDate(day)
        return nd;
    }

    goToNextpage() {
        var url = localStorage.getItem('url')
        if (url) {
            let regex = /[;&]([^=;]+)=([^;#]*)/g;
            let params = {};
            var match;
            while (match = regex.exec(url)) {
                params[match[1]] = match[2];
            }
            if (url === "/" || url === "/signin" || url === "/signup") {
                this.router.navigate(['/home']);
            } else {
                var n1 = url.indexOf(";", 1);
                var str = '';
                if (n1 == -1)
                    str = url;
                else
                    str = url.substring(0, n1);
                if (Object.keys(params).length)
                    this.router.navigate([str, params]);
                else
                    this.router.navigate([str]);
            }
        }
        else
            this.router.navigate(['/home']);
    }

    cal(page, limit, count) {
        if (page * limit <= count)
            return page * limit;
        else
            return count;
    }

    convertPdf(item, col, str) {
        var doc = new jsPDF('landscape', 'pt');
        var rows = [];
        var rowss = [];
        col.length = 1;
        for (let ob of item) {
            rows = [];
            for (let key in ob) {
                if (rows.length == 0) {
                    rows.push(rowss.length + 1);
                }
                const arr = key.replace(/_/g, ' ').split(" ");
                for (var i = 0; i < arr.length; i++) {
                    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
                }
                const str2 = arr.join(" ");
                if (!col.includes(str2)) {
                    col.push(str2);
                }
                var temp = ob[key];
                rows.push(temp);
            }
            rowss.push(rows)
        }

        doc.autoTable(col, rowss, {
            tableWidth: 'auto',
            headerStyles: { columnWidth: '100', fontSize: 6 },
            styles: { columnWidth: 'auto', overflow: 'visible', fontSize: 6 },
            columnStyles: { text: { columnWidth: 'auto' } }
        });
        doc.save(str + '.pdf');
    }

    convertNumber(number) {
        var abs;
        if (number !== void 0) {
            abs = Math.abs(number);
            if (abs >= Math.pow(10, 12)) {
                number = (number / Math.pow(10, 12)).toFixed(0) + "t";
            } else if (abs < Math.pow(10, 12) && abs >= Math.pow(10, 9)) {
                number = (number / Math.pow(10, 9)).toFixed(0) + "b";
            } else if (abs < Math.pow(10, 9) && abs >= Math.pow(10, 6)) {
                number = (number / Math.pow(10, 6)).toFixed(0) + "M";
            } else if (abs < Math.pow(10, 6) && abs >= Math.pow(10, 3)) {
                number = (number / Math.pow(10, 3)).toFixed(0) + "k";
            }
            return number;
        }
    }

    private flattenObjFun = (ob, obj) => {
        for (const i in ob) {
            if ((typeof ob[i]) === 'object' && !Array.isArray(ob[i]) && ob[i]) {
                const temp = this.flattenObjFun(ob[i], obj);
                for (const j in temp) {
                    obj[i + '.' + j] = temp[j];
                }
            }
            else {
                obj[i] = ob[i];
            }
        }
        return obj;
    }

    flattenListObj(dataList): any[] {
        dataList.forEach((ob) => {
            var result = this.flattenObjFun(ob, ob);
            ob = result;
        })
        return dataList;
    }

    getExportableArray(pdfData: any[], selectedItems: any[]) {
        pdfData.forEach(element => {
            for (var key in element) {
                if (Array.isArray(element[key])) {
                    element[key].forEach(inArrItem => {
                        for (var inArrKey in inArrItem) {
                            element[inArrKey] = inArrItem[inArrKey];
                        }
                    });
                }
            }
        });
        var dataList = pdfData;
        var flatDataList = this.flattenListObj(dataList);

        flatDataList.forEach((elementObj) => {
            for (var key in elementObj) {
                if (!selectedItems.find(x => x.key == key)) {
                    delete elementObj[key];
                }
            }
        });
        flatDataList.forEach(element => {
            for (var key in element) {
                if (key.includes(".")) {
                    var getKey = selectedItems.find(x => x.key == key);
                    if (getKey) {
                        element[getKey.itemName] = element[key];
                        delete element[key];
                    }
                }
            }
        });

        flatDataList.forEach(element => {
            for (var key in element) {
                var findEl = selectedItems.find(x => x.key == key);
                if (findEl) {
                    element[findEl.itemName] = element[key];
                    delete element[key];
                }
            }
        })

        return flatDataList;
    }

    removeKeysFromArray(arr: any[], keys: any[]) {
        return arr.map(o => {
            keys.forEach(key => {
                delete o[key];
            });
            return o;
        })
    }

    differenceBetween2Array(array1, array2) {
        let valuesA = array1.reduce((a, { key }) => Object.assign(a, { [key]: key }), {});
        let valuesB = array2.reduce((a, { key }) => Object.assign(a, { [key]: key }), {});
        return [...array1.filter(({ key }) => !valuesB[key]), ...array2.filter(({ key }) => !valuesA[key])];
    }

    deleteValueFromArray(data, key) {
        data.map(obj => {
            delete obj[key];
        })
        return data;
    }

}