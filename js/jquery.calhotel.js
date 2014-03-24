//Plugin creacion calendario hotel
(function ($, undefined) {
    //"use strict";
    //Configuraciones por defecto
    config_default = {
        num_fila: 5,
        dias_sem: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab','Dom']
    };
    moment.lang('es');
    c=0;
    
    $.fn.calhotel = function (config_usuario) {
        config_default = $.extend(config_default, config_usuario);
        this.each(function () {
            var agenda, tbl, cont;
            agenda = new vistaAgenda(config_default);
            tbl = agenda.creaContenido();
            //console.log(tbl);
            cont = $(this);
            cont.append(tbl);
            $('#btnsig').click(function(e){
                c++;
                $('#titFecha').text(devuelveSemana(c));
                actualizaCabeceras(primerdia(c));
            });
            
            $('#btnant').click(function(e){
                c--;
                $('#titFecha').text(devuelveSemana(c));
                actualizaCabeceras(primerdia(c));
            });
            
            $('#btnhoy').click(function(e){
                c=0;
                $('#titFecha').text(devuelveSemana(c));
                actualizaCabeceras(primerdia(c));
            });
        });
    }
    
    function vistaAgenda (datos) {
        this.creaContenido = creaContenido;

        function creaContenido() {
            var rangsem = devuelveSemana(c);
            var pd = primerdia(c).date();
            var html = creaBotonesSup(rangsem) + creaTabla(pd);
            return html;
        }

        function creaBotonesSup(titFecha) {
            var html = "<table class='tbl-botones'>" +
                "<tr>" +
                "<td id='btns_izq'>" +
                "<button type='button' class='btn btn-default' id='btnant'><a>&laquo;</a></button>" +
                "<button type='button' class='btn btn-default' id='btnhoy'><a>Hoy</a></button>" +
                "<button type='button' class='btn btn-default' id='btnsig'><a>&raquo;</a></button>" +
                "</td>" +
                "<td id='tit_tabla'>" +
                "<h1 id='titFecha'>" + titFecha + "</h1>" +
                "</td>" +
                "<td id='btns_der'>" +
                "<button type='button' class='btn btn-default'><a>Semana</a></button>" +
                "<button type='button' class='btn btn-default'><a>Dia</a></button>" +
                "</td>" +
                "</tr>" +
                "</table>";

            return html;
        }

        function creaTabla(primerdia) {
            var tabla = "<table class='tbldiasAgenda'>" +
                creaCabeceraTbl(primerdia) +
                creaCuerpoTbl() +
                "</table>";
            return tabla;
        }

        function creaCabeceraTbl(primerdia) {
            var thead, fil;
            thead = "<thead class='cab-content'><tr class='filasup'>";
            fil = "<th class='celcab celroom'>Rooms</th>";
            dias = datos.dias_sem;
            for (var i = 0; i < dias.length; i++) {
                fil += "<th class='celcab dia"+i+"'>" + dias[i] +" "+(primerdia+i)+ "</th>"
            }
            fil+="<th class='calcabvac'></th>";
            thead += fil + "</tr></thead>";
            return thead;
        }

        function creaCuerpoTbl() {
            var tbody = "<tbody class='cue-content'>";
            var f = '';
            for(var i=0 ; i <datos.num_fila;i++){
                f+="<tr class='filatbl'> " +
                "<td class='celcab celroom'>Room "+(i+1)+"</td>" +
                "<td class='celda' id='ct"+(i+1)+"1'></td>" +
                "<td class='celda' id='ct"+(i+1)+"2'></td>" +
                "<td class='celda' id='ct"+(i+1)+"3'></td>" +
                "<td class='celda' id='ct"+(i+1)+"4'></td>" +
                "<td class='celda' id='ct"+(i+1)+"5'></td>" +
                "<td class='celda' id='ct"+(i+1)+"6'></td>" +
                "<td class='celda' id='ct"+(i+1)+"7'></td>" +
                "</tr>"
            }
            tbody += f + "</tbody>";
            return tbody;
        }
    }
    
    function devuelveSemana(incdec) {
        var fecha = moment().add('week', incdec);
        var iniSem = moment(fecha).startOf('week');//Inicia semana
        var finSem = moment(fecha).endOf('week');//Finaliza semana
        if (moment(iniSem).month()===moment(finSem).month()) {
            return iniSem.format('MMMM D')+' - '+finSem.format('D');
        }else{
            return iniSem.format('MMMM D')+' - '+finSem.format('MMMM D');
        }
    }
    
    function primerdia(incdec) {
        return moment().add('week', incdec);
    }
    
    //pd= primer dia
    function actualizaCabeceras(pd) {
        for(var i = 0; i<config_default.dias_sem.length;i++){
            var d= moment(pd).add('day',(i)).date();
            //var d = moment(fc).date();
            $('.dia'+i).html(dias[i] +" "+d);
        }
    }
    
    
    
    //function buildEventContainer() {
    //    daySegmentContainer =
    //        $("<div class='fc-event-container' style='position:absolute;z-index:8;top:0;left:0'/>")
    //            .appendTo(element);
    //}

    
})(jQuery);
