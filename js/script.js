$(document).ready(function() {
    $('.calhotel').calhotel({
        num_fila: 50,
        datosroom:[
            {fecha_inicia: moment('2014-03-30'), //obligatorio
                fecha_fin: moment('2014-03-30'), //obligatorio
                cuartonro: 1,//obligatorio
                nombre_persona: 'Sr. Lopez',//obligatorio
            },
            {fecha_inicia: moment('2014-03-26'), //obligatorio
                fecha_fin: moment('2014-03-26'), //obligatorio
                cuartonro: 3,//obligatorio
                nombre_persona: 'Sr. Almeida',//obligatorio
            },
            {fecha_inicia: moment('2014-03-29'), //obligatorio
                fecha_fin: moment('2014-03-29'), //obligatorio
                cuartonro: 5,//obligatorio
                nombre_persona: 'Sr. Vargas',//obligatorio
                color:'red'
            }
            
        ]
    });
});
