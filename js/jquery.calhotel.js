//Plugin creacion calendario hotel
(function ($, undefined) {
    moment.lang('es');
    c=0;
    fechaInic=null;
    fechaFin=null;
    //Configuraciones por defecto
    config_default = {
        num_fila: 5,
        dias_sem: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab','Dom'],
        datosroom: [
            {
                fecha_inicia: moment('2014-03-30'),
                fecha_fin: moment('2014-03-30'),
                numero_cuartos: 1,
                cuartonro: 1,
                nrocamas: 1,
                valor: 1,
                nombre_persona: 'Sr. Lopez',
                color: 'blue'
            },
            {
                fecha_inicia: moment('2014-03-25'),
                fecha_fin: moment('2014-03-25'),
                numero_cuartos: 1,
                cuartonro: 3,
                nrocamas: 1,
                valor: 1,
                nombre_persona: 'Sr. Perez',
                color: 'red'
            }
        ]
        
    };
    
    
    $.fn.calhotel = function (config_usuario) {
        config_default = $.extend(config_default, config_usuario);
        this.each(function () {
            var agenda, tbl, cont;
            cont = $(this);
            agenda = new vistaAgenda(config_default);
            contenedor_principal = $("<div class='contenedor-principal'></div>"); //contiene a las tablas de botones y al div secundario
            contenedor_secundario = $("<div class='contenedor-secundario'></div>");
            
            contenido = agenda.creaContenido();//devuelve la tabla
            contenedor_secundario.append(contenido);
            contenedor_principal.append(contenedor_secundario);
            
            cont.append(contenedor_principal);
            ponerCuartosOcupados();
            $('#btnsig').click(function(e){
                c++;
                $('#titFecha').text(devuelveSemana(c));
                actualizaCabeceras(primerdia(c));
                ponerCuartosOcupados();
            });
            
            $('#btnant').click(function(e){
                c--;
                $('#titFecha').text(devuelveSemana(c));
                actualizaCabeceras(primerdia(c));
                ponerCuartosOcupados();
            });
            
            $('#btnhoy').click(function(e){
                c=0;
                $('#titFecha').text(devuelveSemana(c));
                actualizaCabeceras(primerdia(c));
                ponerCuartosOcupados();
            });
        });
    };
    
    function vistaAgenda (datos) {
        this.creaContenido = creaContenido;
        
        function creaContenido() {
            var rangsem = devuelveSemana(c);
            var pd = primerdia(c).date();
            
            var html = "<div class='botones-cabecera'>"+creaBotonesSup(rangsem)+"</div>" + creaTabla(pd);            
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
            //var tabla = "<div class='contenedor-tabla'><table class='tbldiasAgenda'>" +
            //    creaCabeceraTbl(primerdia) +
            //    creaCuerpoTbl() +
            //    "</table></div>";
            var tabla = "<div class='contenedor-tabla'>" +
            " <div class='tbl-cabecera'>" +
            creaCabeceraTbl(primerdia) +
            "</div>" +
            " <div class='tbl-cuerpo'>" +
            creaCuerpoTbl() +
            "</div>" +
            "</div>";
            return tabla;
        }

        function creaCabeceraTbl(primerdia) {
            var thead, fil;
            thead = "<table><thead><tr class='filasup'>";
            fil = "<th class='celcab celroom'>Rooms</th>";
            dias = datos.dias_sem;
            for (var i = 0; i < dias.length; i++) {
                fil += "<th class='celcab dia"+i+"'>" + dias[i] +" "+(primerdia+i)+ "</th>";
            }
            fil+="<th class='calcabvac'></th>";
            thead += fil + "</tr></thead></table>";
            return thead;
        }

        function creaCuerpoTbl() {
            var tbody = "<table><tbody>";
            var f = '';
            for(var i=0 ; i <datos.num_fila;i++){
                f+="<tr class='filatbl' id='fila"+(i+1)+"'> " +
                "<td class='celcab celroom'>Room "+(i+1)+"</td>" +
                "<td class='celda'><div class='evento' id='ct"+(i+1)+"0'><p></p></div></td>" +
                "<td class='celda'><div class='evento' id='ct"+(i+1)+"1'><p></p></div></td>" +
                "<td class='celda'><div class='evento' id='ct"+(i+1)+"2'><p></p></div></td>" +
                "<td class='celda'><div class='evento' id='ct"+(i+1)+"3'><p></p></div></td>" +
                "<td class='celda'><div class='evento' id='ct"+(i+1)+"4'><p></p></div></td>" +
                "<td class='celda'><div class='evento' id='ct"+(i+1)+"5'><p></p></div></td>" +
                "<td class='celda'><div class='evento' id='ct"+(i+1)+"6'><p></p></div></td>" +
                "</tr>";
            }
            tbody += f + "</tbody></table>";
            return tbody;
        }
    }
    
    function devuelveSemana(incdec) {
        var fecha = moment().add('week', incdec);
        var iniSem = moment(fecha).startOf('week');//Inicia semana
        var finSem = moment(fecha).endOf('week');//Finaliza semana
        fechaInic= iniSem;
        fechaFin = finSem;
        if (moment(iniSem).month()===moment(finSem).month()) {
            return iniSem.format('MMMM D')+' - '+finSem.format('D');
        }else{
            return iniSem.format('MMMM D')+' - '+finSem.format('MMMM D');
        }
    }
    
    function primerdia(incdec) {
        fecha = moment().add('week', incdec);
        return moment(fecha).startOf('week');
    }
    
    //pd= primer dia
    function actualizaCabeceras(pd) {
        for(var i = 0; i<config_default.dias_sem.length;i++){
            var d= moment(pd).add('day',(i)).date();
            $('.dia'+i).html(dias[i] +" "+d);
        }
    }

    function ponerCuartosOcupados() {
        var daticos = config_default.datosroom;
        for(d in daticos){
            var div = $('.tbl-cuerpo').find('#ct'+daticos[d].cuartonro+moment(daticos[d].fecha_inicia).weekday());
            if (moment(daticos[d].fecha_inicia)>=fechaInic && moment(daticos[d].fecha_inicia)<=fechaFin) {
                div.css({
                    border: '1px solid green',
                    borderRadius: '5px',
                    boxShadow: '3px 3px 3px 3px rgba(0,0,0,0.3)',
                    backgroundColor: daticos[d].color===undefined ? 'cyan':daticos[d].color,
                    width: '80%'
                });
                div.find('p').html('</br>'+daticos[d].nombre_persona);
            }else{
                div.css({
                    border: 'none',
                    borderRadius: 'none',
                    boxShadow: 'none',
                    backgroundColor: ''
                });
                div.find('p').html('');
            }
        }
    }
    
    
    
})(jQuery);
