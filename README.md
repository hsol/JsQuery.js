
**JsQuery.js**
==========
JsQuery.js is javascript library what can filter your JSON Array.


You can test this library at http://bit.ly/1NRzpBD 

JsQuery has two variable.

First is "**JSON Array**" want to filter and Second is "**Query**"

"**Query**" have structure looks like a DB query but based on javascript's operators.

    {columns} WHERE {conditions} ORDER {column}

{conditions} calculate based by javascript engine.

*setObject(object object)* set object,

*setQuery(string query)* set query string

and you can initialize like this too. "new JsQuery(object object, query string)"


*getObject()* returns object,

*getQuery()* returns query string

and *getResult()* returns filtered object.


**WHERE**

javascript compare syntax


**ORDER**

column, defaults is Ascending.

Descending to plus "-" front of column.


examples;

    var testObject = [{head:1, tail:3},{head:5, tail:7},{head:9, tail:11}];
    var testQuery = "head WHERE tail < 9 ORDER -head"
    var jsQuery = new JsQuery(testObject, testQuery);
    console.log(jsQuery.getResult());
     
    > [{"head":5},{"head":1}]

you may filtering table by this library  after DB filtered.

Thanks you.


Copyright 2016. [HansolLim](https://github.com/hsol) all rights reserved.
