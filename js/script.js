$(document).ready(function() {
    $('.calhotel').calhotel({
        num_fila: 10 ,
        datosroom:[
            {
                fecha_inicia: moment('2014-03-25 10:40'), //obligatorio
                fecha_fin: moment('2014-03-25 11:50'), //obligatorio
                cuartonro: 1,//obligatorio
                nombre_persona: 'Sr. Lopez',//obligatorio
                color:'green'
            },
            {
                fecha_inicia: moment('2014-03-28 07:00'), //obligatorio
                fecha_fin: moment('2014-03-28 19:00'), //obligatorio
                cuartonro: 2,//obligatorio
                nombre_persona: 'Sr. Almeida',//obligatorio
                color:'red'
            },
            {
                fecha_inicia: moment('2014-03-25 12:00'), //obligatorio
                fecha_fin: moment('2014-03-25 13:00'), //obligatorio
                cuartonro: 3,//obligatorio
                nombre_persona: 'Sr. Vargas',//obligatorio
                color:'blue'
            }
            
        ],
        haceClick: function(datos){
            alert('Nombre: '+ datos.nombre_persona+"\n"+'Cuarto: '+ datos.cuartonro);
            //console.log('Nombre: '+ datos.nombre_persona);
            //console.log('Cuarto: '+ datos.cuartonro);
        }
    });
    
});

