/*
 https://github.com/hsol/JsQuery.js
 The MIT License (MIT) Copyright (c) 2016 HansolLim
 */
(function (root) {
    root.JsQuery = function (object, query) {
        var _jsQuery = this;
        _jsQuery._object = null;
        _jsQuery._query = null;

        if (object) _jsQuery._object = object;
        if (query) _jsQuery._query = query;

        _jsQuery.setObject = function (object) {
            if (typeof object === "object") {
                _jsQuery._object = object;
            } else {
                console.error("parameter type error.");
            }
        };

        _jsQuery.setQuery = function (query) {
            if (typeof query === "string") {
                _jsQuery._query = query;
            } else {
                console.error("parameter type error.");
            }
        };

        _jsQuery.getObject = function () {
            return _jsQuery._object;
        };

        _jsQuery.getQuery = function () {
            return _jsQuery._query;
        };

        _jsQuery.getResult = function (object, query) {
            object = object || _jsQuery._object;
            query = query || _jsQuery._query;

            if (object && query) {
                var isContainWhere = query.indexOf("WHERE") != -1;
                var isContainOrder = query.indexOf("ORDER") != -1;

                var queryObject = {
                    columns: [],
                    condition: {
                        where: "",
                        order: ""
                    }
                };

                if (isContainWhere && isContainOrder) {
                    if (query.indexOf("WHERE") > query.indexOf("ORDER")) {
                        queryObject.columns = query.split("ORDER")[0].replace(new RegExp(" ", "gi"), "").split(",");
                        queryObject.condition.order = query.split("ORDER")[1].split("WHERE")[0].trim();
                        queryObject.condition.where = query.split("ORDER")[1].split("WHERE")[1].trim();
                    } else {
                        queryObject.columns = query.split("WHERE")[0].replace(new RegExp(" ", "gi"), "").split(",");
                        queryObject.condition.where = query.split("WHERE")[1].split("ORDER")[0].trim();
                        queryObject.condition.order = query.split("WHERE")[1].split("ORDER")[1].trim();
                    }
                } else if (isContainWhere) {
                    queryObject.columns = query.split("WHERE")[0].replace(new RegExp(" ", "gi"), "").split(",");
                    queryObject.condition.where = query.split("WHERE")[1];
                } else if (isContainOrder) {
                    queryObject.columns = query.split("ORDER")[0].replace(new RegExp(" ", "gi"), "").split(",");
                    queryObject.condition.order = query.split("ORDER")[1];
                } else {
                    queryObject.columns = query.replace(new RegExp(" ", "gi"), "").split(",");
                }

                if (isContainOrder) {
                    if (queryObject.condition.order) {
                        queryObject.condition.order = queryObject.condition.order.trim();
                        if (queryObject.condition.order[0] != "-") {
                            var key = queryObject.condition.order;
                            for (var i = 0; i < object.length; i++) {
                                for (var j = i + 1; j < object.length; j++) {
                                    if (object[i][key] > object[j][key]) {
                                        var temp = object[i];
                                        object[i] = object[j];
                                        object[j] = temp;
                                    }
                                }
                            }
                        } else {
                            var key = queryObject.condition.order.substring(1, queryObject.condition.order.length);
                            for (var i = 0; i < object.length; i++) {
                                for (var j = i + 1; j < object.length; j++) {
                                    if (object[i][key] < object[j][key]) {
                                        var temp = object[i];
                                        object[i] = object[j];
                                        object[j] = temp;
                                    }
                                }
                            }
                        }
                    }
                }

                if (isContainWhere) {
                    if (queryObject.condition.where) {
                        var quotes = false;
                        var quoteString = "";
                        var quoteArray = [];
                        var quoteArrayIndex = 0;
                        for (var idx in queryObject.condition.where) {
                            if (quotes) quoteString += queryObject.condition.where[idx];
                            else quoteString = "";
                            if (queryObject.condition.where[idx] === "'") {
                                if (quotes) {
                                    quoteArray.push(quoteString);
                                    queryObject.condition.where = queryObject.condition.where.replace(quoteString, "[" + (quoteArrayIndex++) + "]");
                                    idx -= (quoteString.length - ("[" + idx + "]").length);
                                }
                                else {
                                    quoteString += quoteString += queryObject.condition.where[idx];
                                }

                                quotes = !quotes;
                            }
                        }

                        queryObject.condition.variable = quoteArray;

                        queryObject.condition.where = queryObject.condition.where.replace(new RegExp(" ", "gi"), "");

                        for (var objectIdx in object) {
                            // test WHERE condition
                            var condition = queryObject.condition.where;
                            for (var key in object[objectIdx]) {
                                if(typeof object[objectIdx][key] === "string")
                                    condition = condition.replace(key, "'" + object[objectIdx][key] + "'");
                                else
                                    condition = condition.replace(key, object[objectIdx][key]);
                            }

                            for (var quoteIdx in quoteArray) {
                                condition = condition.replace("[" + quoteIdx + "]", quoteArray[quoteIdx]);
                            }

                            if (!eval(condition))
                                delete object[objectIdx];
                            else {
                                // test columns exist
                                for (var key in object[objectIdx]) {
                                    var isExist = false;
                                    for (var columnIdx in queryObject.columns) {
                                        if (key == queryObject.columns[columnIdx])
                                            isExist = true;
                                    }

                                    if (!isExist)
                                        delete object[objectIdx][key];
                                }
                            }
                        }
                    }
                    object = object.filter(function (value) {
                        return value
                    });
                }
                return object;
            }else{
                console.error("JsQuery Error. object or query is null,");
            }
        };
    };
})(window);