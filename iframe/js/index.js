/*因为IE的命令不同，不同浏览器存在兼容问题，所以建议使用jQuery*/
/*var myBtn = document.getElementById('myBtn');
var iframe1 = document.getElementById('iframe1');

myBtn.onclick = function() {
    var contWindow = iframe1.contentWindow;
    var contDocument = contWindow.document;
    var innerH1 = contDocument.getElementById('innerH1');
    innerH1.innerHTML = "来自父页面的修改命令";

    contWindow.sayHello();

};

var sayHello = function() {
    alert('父页面的hello');
};*/

$('#myBtn').on('click', function() {
    var c = $('#iframe1').contents().find('#innerH1').html();
    console.log(c);
});