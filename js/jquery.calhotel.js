//Plugin creacion calendario hotel
(function ($, undefined) {
    moment.lang('es');
    c=0, x=0;
    fechaInic=null;
    fechaFin=null;
    //Configuraciones por defecto
    config_default = {
        num_fila: 5,
        dias_sem: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab','Dom'],
        datosroom: [],
        haceClick: function(datos){},
        clickCelda: function(id,ev){
            //el $(this) es la celda
            if ($(this).find('.evento').length) {
                ev.preventDefault();
            }else{
                alert('Hola desde la celda: '+id);
            }
        }
    };

    //con esto se llama desde javascript
    $.fn.calhotel = function (config_usuario) {
        config_default = $.extend(config_default, config_usuario);
        this.each(function () {
            var semana, cont, vistadef='semana';
            cont = $(this);
            semana = new vistaSemana(config_default);
            dia = new vistaDia(config_default);
            contenedor_principal = $("<div class='contenedor-principal'></div>"); //contiene a las tablas de botones y al div secundario
            contenedor_secundario = $("<div class='contenedor-secundario'></div>");
            tblBotones = creaBotonesSup();
            contenedor_secundario.append(tblBotones);
            poneSemana(0);
            contenedor_principal.append(contenedor_secundario);
            cont.append(contenedor_principal);
            desactivabotonHoy($('#btnhoy'));
            $('#btnSemana').attr('disabled',true);
            semana.ponerCuartosOcupados();
            ponEventos();
            
            $('#btnsig').click(function(e){
                if(vistadef==='semana'){
                    c++;
                    $('#titFecha').text(devuelveSemana(c));
                    actualizaCabecerasSemana(primerdia(c));
                    semana.ponerCuartosOcupados();
                }else if(vistadef==='dia'){
                    x++;
                    var diamost = devuelveDia(x);
                    $('#titFecha').text(diamost.format('MMMM D, YYYY'));
                    actualizaCabeceraDia(x);
                    dia.ponerCuartosOcupadosDia(diamost);
                }
                desactivabotonHoy($('#btnhoy'));
            });

            $('#btnant').click(function(e){
                if(vistadef==='semana'){
                    c--;
                    $('#titFecha').text(devuelveSemana(c));
                    actualizaCabecerasSemana(primerdia(c));
                    semana.ponerCuartosOcupados();
                }else if(vistadef==='dia'){
                    x--;
                    var diamost = devuelveDia(x);
                    $('#titFecha').text(diamost.format('MMMM D, YYYY'));
                    actualizaCabeceraDia(x);
                    dia.ponerCuartosOcupadosDia(diamost);
                }
                desactivabotonHoy($('#btnhoy'));
            });

            $('#btnhoy').click(function(e){
                if(vistadef==='semana'){
                    c=0;
                    $('#titFecha').text(devuelveSemana(c));
                    actualizaCabecerasSemana(primerdia(c));
                    semana.ponerCuartosOcupados();
                }else if(vistadef==='dia'){
                    x=0;
                    var diamost = devuelveDia(x);
                    $('#titFecha').text(diamost.format('MMMM D, YYYY'));
                    actualizaCabeceraDia(x);
                    dia.ponerCuartosOcupadosDia(diamost);
                }
                desactivabotonHoy($('#btnhoy'));
            });

            $('#btnSemana').click(function(e){
                c=0;//desactivar si no se quiere que coja la semana actual
                $('#titFecha').text(devuelveSemana(c));
                poneSemana(1);
                semana.ponerCuartosOcupados();
                vistadef='semana';
                $('#btnSemana').attr('disabled',true);
                $('#btnDia').attr('disabled',false);
                ponEventos();
            });

            $('#btnDia').click(function(e){
                x=0;//Desactivar si no se quiere q coja el dia actual
                //console.log('Si llega a dia');
                var diamost = devuelveDia(x);
                $('#titFecha').text(diamost.format('MMMM D, YYYY'));
                poneDia();
                vistadef='dia';
                actualizaCabeceraDia(x);
                dia.ponerCuartosOcupadosDia(diamost);
                desactivabotonHoy($('#btnhoy'));
                $('#btnSemana').attr('disabled',false);
                $('#btnDia').attr('disabled',true);
                ponEventos();
            });

            function poneSemana(opc){ //opc:1 si es llamada desde el btnSemana
                if(opc === 1){
                   contenedor_secundario.find('.contenedor-tabla').remove();
                }
                tblContenidos= semana.creaContenido();
                contenedor_secundario.append(tblContenidos);
            }

            function poneDia(){
                contenedor_secundario.find('.contenedor-tabla').remove();
                tblContenidos = dia.creaTabla();
                contenedor_secundario.append(tblContenidos);
            }
            
            function ponEventos() {
                console.log(vistadef);
                if (vistadef==='semana') {
                    //Eventos para las celdas
                    $('.cont_tblcuerpo').on( "click", ".celda", function(ev) {
                        config_default.clickCelda.call(this,this.id,ev);
                    });
                    
                    $('.cont_tblcuerpo').on( "mousedown", ".celda", function(ev) {
                        if ($(this).find('.evento').length) {
                            ev.preventDefault();
                        }else{
                            this.bgColor = '#EFBDBD';
                        }
                    });
                    $('.cont_tblcuerpo').on( "mouseup", ".celda", function(ev) {
                        if ($(this).find('.evento').length) {
                            ev.preventDefault();
                        }else{
                            this.bgColor = '';
                        }
                    });
                }else{
                    //Eventos para las celdas
                    $('.cont_tblcuerpo').on( "click", ".celdadia", function(ev) {
                        config_default.clickCelda.call(this,this.id,ev);
                    });
                    
                    $('.cont_tblcuerpo').on( "mousedown", ".celdadia", function(ev) {
                        if ($(this).find('.evento').length) {
                            ev.preventDefault();
                        }else{
                            this.bgColor = '#EFBDBD';
                        }
                    });
                    $('.cont_tblcuerpo').on( "mouseup", ".celdadia", function(ev) {
                        if ($(this).find('.evento').length) {
                            ev.preventDefault();
                        }else{
                            this.bgColor = '';
                        }
                    });
                }
                
            }
        });
    };

    function desactivabotonHoy(btn) {
        var hoy = moment();
        if (mismaFecha(hoy,fechaInic)||mismaFecha(hoy,fechaFin)//si la fecha actual es igual a fecha inicio o fechafin
            ||((moment(hoy).isAfter(fechaInic))&&(moment(hoy).isBefore(fechaFin)))) {//si la fecha actual esta entre fechainic y fechafin
            $(btn).attr("disabled", true);
        }else{
            $(btn).attr("disabled", false);
        }
    }

    function creaBotonesSup() {
        var html = "<div class='botones-cabecera'><table class='tbl-botones'>" +
                "<tr>" +
                "<td id='btns_izq'>" +
                "<button type='button' class='btn btn-default' id='btnant'><a style='text-decoration:none;'>&laquo;</a></button>" +
                "<button type='button' class='btn btn-default' id='btnhoy'><a style='text-decoration:none;'>Hoy</a></button>" +
                "<button type='button' class='btn btn-default' id='btnsig'><a style='text-decoration:none;'>&raquo;</a></button>" +
                "</td>" +
                "<td id='tit_tabla'>" +
                "<h1 id='titFecha'>" + devuelveSemana(c)+ "</h1>" +
                "</td>" +
                "<td id='btns_der'>" +
                "<button type='button' class='btn btn-default' id='btnSemana'><a style='text-decoration:none;'>Semana</a></button>" +
                "<button type='button' class='btn btn-default' id='btnDia'><a style='text-decoration:none;'>Dia</a></button>" +
                "</td>" +
                "</tr>" +
                "</table></div>";

            return html;
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

    function devuelveDia(index){
        var fecha = moment().add('day',index);
        fechaInic = fecha;
        fechaFin = fecha;
        return fecha;
    }

    function primerdia(incdec) {
        fecha = moment().add('week', incdec);
        return moment(fecha).startOf('week');
    }

    function mismaFecha(f1,f2){
        var esIgual = false;
        if(moment(f1).isSame(f2,'year')&&//Cuando el diainicial es igual al dia mostrado
            moment(f1).isSame(f2,'month')&&
            moment(f1).isSame(f2,'day')){
                esIgual = true;
        }
        return esIgual;
    }

    //pd= primer dia
    function actualizaCabecerasSemana(pd) {
        for(var i = 0; i<config_default.dias_sem.length;i++){
            var d= moment(pd).add('day',(i)).date();
            $('.dia'+i).html(config_default.dias_sem[i] +" "+d);
        }
    }

    function actualizaCabeceraDia(d){
        $('.celcabdia').html(devuelveDia(x).format('dddd').toUpperCase());
    }

    //**************************************** PARA LA VISTA DE SEMANA**********************************************
    function vistaSemana (datos) {
        this.creaContenido = creaContenido;
        this.ponerCuartosOcupados = ponerCuartosOcupados;

        function creaContenido() {
            var pd = primerdia(c).date();
            var tabla = creaTabla(pd);
            return tabla;
        }

        function creaTabla(primerdia) {            
            var divtbl = $("<div class='contenedor-tabla'></div>");
            var cabecera = $("<div class='cont_tblcabecera'></div>");
            var cuerpo = $("<div class='cont_tblcuerpo'></div>");
            cabecera.append(creaCabeceraTbl(primerdia));
            cuerpo.append(creaCuerpoTbl());
            divtbl.append(cabecera);
            divtbl.append(cuerpo);
            return divtbl;
        }

        function creaCabeceraTbl(primerdia) {
            var dias = datos.dias_sem;
            var table = $("<table></table>");
            var thead = $("<thead></thead>");
            var tr = $("<tr class='filasup'></tr>");
            //Cabecera Rooms
            var th = $("<th class='celcab celroom'></th>");
            th.html('Room');
            tr.append(th);
            //Dias de la semana
            for (var i = 0; i < dias.length; i++) {
                var h = $("<th class='celcab'></th>");
                h.addClass('dia'+i).html(dias[i] +" "+(primerdia+i));
                tr.append(h);
            }
            //Celda vacia final
            var v = $("<th class='calcabvac'></th>");
            tr.append(v);
            thead.append(tr);
            table.append(thead);
            return table;
        }

        function creaCuerpoTbl() {
            var table = $("<table></table>");
            var tbody = $("<tbody></tbody>");
            for(var i=0 ; i <datos.num_fila;i++){
                var tr = $("<tr class='filatbl'></tr>");
                tr.attr('id','fila'+(i+1));
                var tdr= $("<td class='celcab celroom'></td>");
                tdr.html('Room '+(i+1));
                tr.append(tdr);
                for(var c=0; c<7;c++){
                    var tdc = $("<td class='celda'></td>");
                    if(eshoy(c)===true){
                        tdc.addClass('celhoy');
                    }
                    tdc.attr('id', 'ct'+(i+1)+c);
                    tr.append(tdc);
                }
                tbody.append(tr);
            }
            table.append(tbody);
            return table;
        }

        function eshoy(i){
            var es = false;
            var hoy = moment().weekday();
            if(hoy===i){
                es = true;
            }
            return es;
        }
        
        
        function ponerCuartosOcupados() {
            var daticos = datos.datosroom;
            limpiarCuartos();
            for(var d=0; d<daticos.length; d++){
                var celda = $('.cont_tblcuerpo').find('#ct'+daticos[d].cuartonro+''+moment(daticos[d].fecha_inicia).weekday());
                var diactual = moment(daticos[d].fecha_inicia).clone();//dia actual ocupacion
                var diafinocup = moment(daticos[d].fecha_fin).clone();//dia de fin de ocupacion
                if ((moment(diactual).isAfter(fechaInic) //Si esta despues de fechaInic -> inicio de semana mostrada y
                    && moment(diactual).isBefore( fechaFin))||mismaFecha(diactual,fechaInic)||mismaFecha(diactual, fechaFin)) {// si esta antes de fechaFin -> fin de la semana mostrada
                    while ((diactual.isBefore(diafinocup) || mismaFecha(diactual,diafinocup))&& diactual.isBefore(fechaFin)) {
                        remuevediv(celda);//Nos aseguramos q el div no este ocupado
                        celda.append(creadiv(daticos[d]));
                        diactual = moment(diactual).add('day',1);
                        celda = $('.cont_tblcuerpo').find('#ct'+daticos[d].cuartonro+''+diactual.weekday());
                    }
                }else if((moment(diafinocup).isAfter(fechaInic) && moment(diactual).isBefore(fechaInic))){
                    //&& moment(diafinocup).isBefore( fechaFin))){
                    diactual = fechaInic.clone();
                    celda = $('.cont_tblcuerpo').find('#ct'+daticos[d].cuartonro+''+diactual.weekday());//como actualizamos diactual entonces debemos obtener la nueva celda
                    while(diactual.isBefore(diafinocup) || mismaFecha(diactual,diafinocup)){
                        remuevediv(celda);//Nos aseguramos q el div no este ocupado
                        celda.append(creadiv(daticos[d]));
                        diactual = moment(diactual).add('day',1);
                        celda = $('.cont_tblcuerpo').find('#ct'+daticos[d].cuartonro+''+diactual.weekday());
                    }
                }
            }
        }
    }

    function creadiv(datos) {
        var div = $("<div class='evento'></div>");
        var h5 = $('<h5></h5>');
        var p = $('<p></p>');
        
        h5.html(moment(datos.fecha_inicia).hour()+':'+moment(datos.fecha_inicia).minute()+
                        ' - '+moment(datos.fecha_fin).hour()+':'+moment(datos.fecha_fin).minute());
        p.html(datos.nombre_persona);        
        
        div.append(h5);
        div.append(p);
        div.css({
            border: '1px solid gray',
            borderRadius: '5px',
            boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.3)',
            backgroundColor: datos.color===undefined ? 'red':datos.color, //color rojo para ocupado
            width: '95%',
            cursor:'pointer'
            //left: left,
            //top: top
        }).click(function(ev){
            config_default.haceClick.call(this,datos);
        });
        return div;
    }
    
    function remuevediv(celda){
        celda.find('div').remove();
    }

    function limpiarCuartos(){
        $('.cont_tblcuerpo').find('.evento').remove();
    }



    //**************************************** PARA LA VISTA DE DIA **********************************************
    function vistaDia (datos){

        this.creaTabla= creaTabla;
        this.ponerCuartosOcupadosDia = ponerCuartosOcupadosDia;
        
        function creaTabla() {            
            var divtbl = $("<div class='contenedor-tabla'></div>");
            var cabecera = $("<div class='cont_tblcabecera'></div>");
            var cuerpo = $("<div class='cont_tblcuerpo'></div>");
            cabecera.append(creaCabeceraTbl());
            cuerpo.append(creaCuerpoTbl());
            divtbl.append(cabecera);
            divtbl.append(cuerpo);
            return divtbl;
        }

        function creaCabeceraTbl() {
            var table = $("<table></table>");
            var thead = $("<thead></thead>");
            var tr = $("<tr class='filasupdia'></tr>");
            //Cabecera Rooms
            var th = $("<th class='celcab celroom'></th>");
            //Celda dia
            var thd = $("<th class='celcabdia'></th>");
            //Celda vacia final
            var v = $("<th class='calcabvac'></th>");
            th.html('Room');
            tr.append(th);
            tr.append(thd);
            tr.append(v);
            thead.append(tr);
            table.append(thead);
            return table;
        }

        function creaCuerpoTbl() {
            var table = $("<table></table>");
            var tbody = $("<tbody></tbody>");
            for(var i=0 ; i <datos.num_fila;i++){
                var tr = $("<tr class='filatbldia'></tr>");
                var tdr= $("<td class='celcab celroom'></td>");
                var tdc = $("<td class='celdadia'></td>");
                tdr.html('Room '+(i+1));
                tdc.attr('id', 'ct'+(i+1));
                tr.append(tdr);
                tr.append(tdc);
                tbody.append(tr);
            }
            table.append(tbody);
            return table;
        }

        function ponerCuartosOcupadosDia(diamostrado){//objeto moment del dia mostrado
            var daticos = datos.datosroom;
            limpiarCuartos();
            for (var d=0; d<daticos.length; d++) {
                 var celda = $('.cont_tblcuerpo').find('#ct'+daticos[d].cuartonro);
                if(mismaFecha(daticos[d].fecha_inicia,diamostrado)||mismaFecha(daticos[d].fecha_fin,diamostrado)){
                    celda.append(creadiv(daticos[d]));
                }else if(moment(diamostrado).isBefore(daticos[d].fecha_fin)//Si diamostrado es antes de fechafin y diamostrado es mayor a fecha inicial
                    &&moment(diamostrado).isAfter(daticos[d].fecha_inicia)){
                    celda.append(creadiv(daticos[d]));
                }
            }
        }
    }
})(jQuery);
