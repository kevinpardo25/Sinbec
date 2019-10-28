//document.querySelector('#prueba').addEventListener('click', function(){
    
//obtenerDatos();


let datos

//datos = function() {
//let url = ´www.datos.gov.co/resource/9ghi-7xv6.json´
//let url = `https://www.datos.gov.co/resource/9ghi-7xv6.json?nomarea=ADMINISTRACIÓN`;
//let url = 'https://www.datos.gov.co/resource/9ghi-7xv6.json';



//const api= new XMLHttpRequest();
//api.open('GET', url, true);
//api.send();
//api.onreadystatechange=function(){
 //   if(this.status==200 && this.readyState== 4){
   //     console.log(this.responseText);
//        return this.responseText;
 //   }
//}


//}
var express = require('express');
var router = express.Router();
router.get('/api/datos', function(req, res, next) {
    res.send('respond with a resource');
  });

module.exports= datos;
