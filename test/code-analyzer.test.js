/* eslint-disable no-console,complexity,null */
import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {generate} from 'escodegen';
import * as esprima from 'esprima';
describe('my parser',()=>{
    it('sub1',()=>{
        assert.deepEqual(esprima.parseScript(generate(parseCode('function foo(x, y, z){\n' +
            '    let a = x[0] + 1;\n' +
            '}','(x=[1,2,3], y=2, z=3)',{}))),esprima.parseScript(
            '\t\n' +
            'function foo(x, y, z) {\n' +
            '}'));});
    it('sub2',()=>{
        assert.deepEqual(esprima.parseScript(generate(parseCode('function foo(x, y, z){\n' +
            '    let a = x[0] + 1;\n' +
            'let b=x[1]++;\n' +
            'return a+b;\n' +
            '}','(x=[1,2,3], y=2, z=3)',{}))),esprima.parseScript(
            'function foo(x, y, z) {\n' +
            'return x[0] + 1 + x[1]++;\n' +
            '}'));
    });
    it('if',()=>{
        assert.deepEqual(esprima.parseScript(generate(parseCode('function foo(x, y, z){\n' +
            '    let a = y;\n' +
            'if(a>3)\n' +
            'return a;\n' +
            'return a+z;\n' +
            '}','(x=[1,2,3], y=2, z=3)',{}))),esprima.parseScript(
            '\t\n' +
            'function foo(x, y, z) {\n' +
            'if (y > 3)\n' +
            'return y;\n' +
            'return y + z;\n' +
            '}'));
    });
    it('if-else',()=>{
        assert.deepEqual(esprima.parseScript(generate(parseCode('function foo(x, y, z){\n' +
            '    let a = y;\n' +
            'if(a>3)\n' +
            'return a;\n' +
            'else\n' +
            'return a+z;\n' +
            '}','(x=[1,2,3], y=2, z=3)',{}))),esprima.parseScript(
            'function foo(x, y, z) {\n' +
            'if (y > 3)\n' +
            'return y;\n' +
            'else \n' +
            'return y + z;\n' +
            '}'));
    });
    it('while',()=>{
        assert.deepEqual(esprima.parseScript(generate(parseCode('function foo(x, y, z){\n' +
            '    let a = y;\n' +
            'while(a<7)\n' +
            '{\n' +
            'a=y+1;\n' +
            'y=y+1;\n' +
            '}\n' +
            'return a;\n' +
            '}','(x=[1,2,3], y=2, z=3)',{}))),esprima.parseScript(
            'function foo(x, y, z) {\n' +
            'while (y < 7) {\n' +
            'y = y + 1;\n' +
            '}\n' +
            'return y + 1;\n' +
            '}'));
    });
    it('while-if',()=>{
        assert.deepEqual(esprima.parseScript(generate(parseCode('let i=0;\n' +
            'function foo(x, y, z){\n' +
            '    let a = y;\n' +
            'while(a<7)\n' +
            '{\n' +
            'if(x[i]>y)\n' +
            'y=x[i]\n' +
            'i++;\n' +
            'a=y+1;\n' +
            '}\n' +
            'return a;\n' +
            '}','(x=[1,2,3], y=2, z=3)',{}))),esprima.parseScript('let i=0;\n'+
            '\t\n' +
            'function foo(x, y, z) {\n' +
            'while (y < 7) {\n' +
            'if (x[i] > y)\n' +
            'y = x[i];\n' +
            'i++;\n' +
            '}\n' +
            'return y + 1;\n' +
            '}'));
    });
    it('example',()=>{
        assert.deepEqual(esprima.parseScript(generate(parseCode('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '        return x + y + z + c;\n' +
            '    }\n' +
            '}\n','(x=1, y=2, z=3)',{}))),esprima.parseScript(
            '\t\n' +
            'function foo(x, y, z) {\n' +
            'if (x + 1 + y < z) {\n' +
            'return x + y + z + (0 + 5);\n' +
            '} else if (x + 1 + y < z * 2) {\n' +
            'return x + y + z + (0 + x + 5);\n' +
            '} else {\n' +
            'return x + y + z + (0 + z + 5);\n' +
            '}\n' +
            '}'));
    });
    it('example2',()=>{
        assert.deepEqual(esprima.parseScript(generate(parseCode('function foo(x, y, z,t){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    while(a+b<c)\n' +
            '{\n' +
            't[0]++;\n' +
            't[1]++;\n' +
            '}\n' +
            '    if (t[0] < z) {\n' +
            '        c = c + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '        return x + y + z + c;\n' +
            '    }\n' +
            '}','(x=1, y=2, z=3,t=[1,2,3])',{}))),esprima.parseScript(
            '\t\n' +
            'function foo(x, y, z, t) {\n' +
            'while (x + 1 + (x + 1 + y) < 0) {\n' +
            't[0]++;\n' +
            't[1]++;\n' +
            '}\n' +
            'if (t[0] < z) {\n' +
            'return x + y + z + (0 + 5);\n' +
            '} else if (x + 1 + y < z * 2) {\n' +
            'return x + y + z + (0 + x + 5);\n' +
            '} else {\n' +
            'return x + y + z + (0 + z + 5);\n' +
            '}\n' +
            '}'));
    });
    it('example3',()=>{
        assert.deepEqual(esprima.parseScript(generate(parseCode('function foo(x, y, z,t){\n' +
            '    let a=2;\n' +
            'let b=x+y+z+a;\n' +
            'if(y<t[a])\n' +
            'y=y+z;\n' +
            'else if(z==t[a])\n' +
            'x=x+1;\n' +
            'return x+y+b\n' +
            '}\n','(x=1, y=2, z=3,t=[1,2,3])',{}))),esprima.parseScript(
            '\t\n' +
            'function foo(x, y, z, t) {\n' +
            'if (y < t[2])\n' +
            'y = y + z;\n' +
            'else if (z == t[2])\n' +
            'x = x + 1;\n' +
            'return x + y + (x + y + z + 2);\n' +
            '}'));
    });
    it('example4',()=>{
        assert.deepEqual(esprima.parseScript(generate(parseCode('function helpme(a){\n' +
            'let b=1;\n' +
            'let c=2;\n' +
            'while(a+b>-1)\n' +
            '{\n' +
            'a--;\n' +
            '}\n' +
            'while(a-b<-1)\n' +
            '{\n' +
            'a++;\n' +
            '}\n' +
            'return a+b;\n' +
            '}','(a=2)',{}))),esprima.parseScript(
            '\t\n' +
            '\n' +
            'function helpme(a) {\n' +
            'while (a + 1 > -1) {\n' +
            'a--;\n' +
            '}\n' +
            'while (a - 1 < -1) {\n' +
            'a++;\n' +
            '}\n' +
            'return a + 1;\n' +
            '}'));
    });
});