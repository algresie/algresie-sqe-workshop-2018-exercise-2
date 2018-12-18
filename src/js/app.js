import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {generate} from 'escodegen';
$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let jh={};
        let codeToParse = $('#codePlaceholder').val();
        let args=$('#getElements').val();
        let parsedCode = parseCode(codeToParse,args,jh);
        $('#please').empty().append(generate(parsedCode,{format:{newline:'<br>'},verbatim: 'color'}));
        $('#parsed').empty().append(generate(parsedCode,{format:{newline:'<br>'},verbatim: 'color'}));
    });
});
