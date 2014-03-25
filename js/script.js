$(document).ready(function() {
    $('.calhotel').calhotel({
        num_fila: 8,
        datosroom:[
            {fecha_inicia: moment('2014-03-25'), //obligatorio
                fecha_fin: moment('2014-03-25'), //obligatorio
                cuartonro: 1,//obligatorio
                nombre_persona: 'Sr. Lopez',//obligatorio
                color:'yellow'
            },
            {fecha_inicia: moment('2014-03-25'), //obligatorio
                fecha_fin: moment('2014-03-25'), //obligatorio
                cuartonro: 1,//obligatorio
                nombre_persona: 'Sr. Almeida',//obligatorio
                color:'red'
            },
            {fecha_inicia: moment('2014-03-25'), //obligatorio
                fecha_fin: moment('2014-03-25'), //obligatorio
                cuartonro: 1,//obligatorio
                nombre_persona: 'Sr. Vargas',//obligatorio
                color:'blue'
            }
            
        ]
    });
    
});

