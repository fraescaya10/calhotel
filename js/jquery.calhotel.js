//Plugin creacion calendario hotel
(function($, undefined){
    //Configuraciones por defecto
    var config_default = {
        num_fila: 5,
        dias_sem: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
    }
    
    
    $.fn.calhotel = function(config_usuario){      
        
        config_default = $.extend(config_default, config_usuario);
        
        this.each(function(){ 
            var agenda = new vistaAgenda(config_default);    
            var tbl = agenda.creaContenido();    
            //console.log(tbl);
            cont = $(this);           
            cont.append(tbl);
        });
    }
    
    function vistaAgenda(datos){
        this.creaContenido = creaContenido;  
        
        function creaContenido(){                        
            var html= creaBotonesSup('Marzo 16 - 22')+creaTabla();
            return html;
        }
        
        function creaBotonesSup(titFecha){
            var html = "<table class='tbl-botones'>"+
                        "<tr>"+
                        "<td id='btns_izq'>"+
                        "<button type='button' class='btn btn-default'><a>&laquo;</a></button>"+
                        "<button type='button' class='btn btn-default'><a>Hoy</a></button>"+
                        "<button type='button' class='btn btn-default'><a>&raquo;</a></button>"+
                        "</td>"+
                        "<td id='tit_tabla'>"+
                        "<h1>"+titFecha+"</h1>"+
                        "</td>"+
                        "<td id='btns_der'>"+
                        "<button type='button' class='btn btn-default'><a>Semana</a></button>"+
                        "<button type='button' class='btn btn-default'><a>Dia</a></button>"+
                        "</td>"+
                        "</tr>"+
                        "</table>";
            
            return html;
        }
              
        function creaTabla(){
           var tabla = "<table class='tbldiasAgenda'>"+
               creaCabeceraTbl()+
               creaCuerpoTbl()+
               "</table>";
           return tabla;
        }
        
        function creaCabeceraTbl(){
            var thead = "<thead class='cab-content'><tr class='filasup'>";
            var fil ="<th class='celcab celroom'>Rooms</th>";
            dias = datos.dias_sem;
            for(var i=0; i<dias.length;i++){
                fil+="<th class='celcab'>"+dias[i]+"</th>"
            }
            thead+=fil+"</tr></thead>";
            return thead;
        }
        
        function creaCuerpoTbl(){
             var html = "<tbody>";
             
             html+="</tbody>";
            return html;              
        }
    }
})(jQuery);
