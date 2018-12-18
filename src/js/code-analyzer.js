/* eslint-disable no-console,complexity,null,no-unused-vars */
import * as esprima from 'esprima';
import {generate} from 'escodegen';

const  program=(parsed,dic,glb,funcs)=>{
    parsed.body=parsed.body.map((a)=>checkType(a,dic,glb,funcs));
    return parsed;
};
const sequence=(parsed,dic,glb,funcs)=>{
    parsed.expressions=parsed.expressions.map((a)=>checkType(a,dic,glb,funcs));
    return parsed;
};
const expression=(parsed,dic,glb,funcs)=>{
    parsed.expression=checkType(parsed.expression,dic,glb,funcs);
    if(parsed.expression!==undefined) return parsed;
};
const declarations=(parsed,dic,glb,funcs)=>{
    parsed.declarations=parsed.declarations.map((node)=>{
        node.init=checkType(node.init,dic,glb,funcs);
        dic[node.id.name]=node.init;
        if(glb[node.id.name]!=undefined)
            return node;
    }).filter((a)=>a!==undefined);
    if(parsed.declarations.length>0)
        return parsed;
};
const unary=(parsed,dic,glb,funcs)=>
{
    parsed.argument=checkType(parsed.argument,dic,glb,funcs);
    return parsed;
};
const binary=(parsed,dic,glb,funcs)=>{
    parsed.left=checkType(parsed.left,dic,glb,funcs);
    parsed.right=checkType(parsed.right,dic,glb,funcs);
    return parsed;
};
const addFuncs=(funcs)=>{
    funcs['Program']=program;
    funcs['SequenceExpression']=sequence;
    funcs['FunctionDeclaration']=functionDecl;
    funcs['AssignmentExpression']=functionAssignment;
    funcs['ExpressionStatement']=expression;
    funcs['VariableDeclaration']=declarations;
    funcs['MemberExpression']=member;
    funcs['UnaryExpression']=unary;
    funcs['BinaryExpression']=binary;
    funcs['Identifier']=identifier;
    funcs['WhileStatement']=whileStatment;
    funcs['BlockStatement']=blockStatment;
    funcs['ReturnStatement']=returnStatement;
    funcs['Literal']=literal;
    funcs['IfStatement']=ifStatemenet;
    funcs['UpdateExpression']=updateExpression;
    funcs['ArrayExpression']=array;
    return funcs;
};
const array=(parsed,dic,glb,funcs)=>{
    parsed.elements=parsed.elements.map((a)=>checkType(a,dic,glb,funcs));
    return parsed;
};
const literal=(parsed,dic,glb,funcs)=>{
    return parsed;
};
const  identifier=(parsed,dic,glb,funcs)=>{
    if(dic[parsed.name]!==undefined)
        return dic[parsed.name];
    return parsed;
};
const checkType=(parsed,dic,glb,funcs)=>{
    return funcs[parsed.type](parsed,dic,glb,funcs);
};
const member=(parsed,dic,glb,funcs)=>{
    parsed.object=checkType(parsed.object,dic,glb,funcs);
    parsed.property=checkType(parsed.property,dic,glb,funcs);
    return parsed;
};
const updateExpression=(parsed,dic,glb,funcs)=>{
    parsed.argument=checkType(parsed.argument,dic,glb,funcs);
    return parsed;
};
const ifStatemenet= (parsed,dic,glb,funcs)=>{
    parsed.test=checkType(parsed.test,dic,glb,funcs);
    let test = eval(generate(checkType(JSON.parse(JSON.stringify(parsed.test)), JSON.parse(JSON.stringify(glb)), {}, funcs)));
    if (test == true) {
        parsed.test['color'] = '<green>' + generate(parsed.test) + '</green>';
    } else parsed.test['color'] = '<red>' + generate(parsed.test) + '</red>';
    let dic1=JSON.parse(JSON.stringify(dic));
    let dic2=JSON.parse(JSON.stringify(dic));
    parsed.consequent=checkType(parsed.consequent,dic1,glb,funcs);
    if(parsed.alternate!=undefined) parsed.alternate=checkType(parsed.alternate,dic2,glb,funcs);
    return parsed;
};
const returnStatement=(parsed,dic,glb,funcs)=>{
    parsed.argument=checkType(parsed.argument,dic,glb,funcs);
    return parsed;
};

const blockStatment=(parsed,dic,glb,funcs)=>{
    parsed.body=parsed.body.map((a)=>checkType(a,dic,glb,funcs)).filter((a)=>a!=undefined);
    return parsed;
};
const whileStatment=(parsed,dic,glb,funcs)=>{
    parsed.test=checkType(parsed.test,dic,glb,funcs);
    let test = eval(generate(checkType(JSON.parse(JSON.stringify(parsed.test)),JSON.parse(JSON.stringify(glb)),{},funcs)));
    if (test == true) {
        parsed.test['color'] = '<green>'+generate(parsed.test)+'</green>';
    }
    else parsed.test['color']='<red>'+generate(parsed.test)+'</red>';
    parsed.body=checkType(parsed.body,dic,glb,funcs);
    return parsed;
};
const functionAssignment=(parsed,dic,glb,funcs)=>{
    parsed.right=checkType(parsed.right,dic,glb,funcs);
    dic[parsed.left.name] = parsed.right;
    if(glb[parsed.left.name]!=undefined)
        return parsed;
};

const functionDecl=(parsed,dic,glb,funcs)=>{
    parsed.params=parsed.params.map((par)=>{dic[par.name]=par;return par;});
    parsed.body=checkType(parsed.body,dic,glb,funcs);
    return parsed;
};

export const parseCode = (codeToParse,args,jh) => {
    jh=esprima.parseScript(codeToParse);
    let glb={};
    let funcs={};
    let lcl={};
    funcs=addFuncs(funcs);
    jh.body=jh.body.map((a)=>{if(a.type!='FunctionDeclaration'){return checkType(a,glb,glb,funcs);}else return a;}).filter((a)=>a!==undefined);//get globals
    checkType(esprima.parseScript(args),glb,{},funcs,true);
    jh.body=jh.body.map((a)=>{if(a.type=='FunctionDeclaration'){return checkType(a,lcl,glb,funcs);}else return a;}).filter((a)=>a!==undefined);//subsitute
    /*console.log(jh);
    console.log(generate(jh));*/
    return jh;

};
