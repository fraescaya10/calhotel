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
        datosroom: [
            {
                fecha_inicia: moment('2014-03-30'),
                fecha_fin: moment('2014-03-30'),
                cuartonro: 1,
                nrocamas: 1,
                valor: 1,
                nombre_persona: 'Sr. Lopez',
                color: 'blue'
            },
            {
                fecha_inicia: moment('2014-03-25'),
                fecha_fin: moment('2014-03-25'),
                cuartonro: 3,
                nrocamas: 1,
                valor: 1,
                nombre_persona: 'Sr. Perez',
                color: 'red'
            }
        ],
        haceClick: function(datos){}

    };

    //con esto se llama desde javascript
    $.fn.calhotel = function (config_usuario) {
        config_default = $.extend(config_default, config_usuario);
        this.each(function () {
            var agenda, cont, vistadef='semana';
            cont = $(this);
            agenda = new vistaAgenda(config_default);
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
            agenda.ponerCuartosOcupados();

            $('#btnsig').click(function(e){
                if(vistadef==='semana'){
                    c++;
                    $('#titFecha').text(devuelveSemana(c));
                    actualizaCabecerasSemana(primerdia(c));
                    agenda.ponerCuartosOcupados();
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
                    agenda.ponerCuartosOcupados();
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
                    agenda.ponerCuartosOcupados();
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
                agenda.ponerCuartosOcupados();
                vistadef='semana';
                $('#btnSemana').attr('disabled',true);
                $('#btnDia').attr('disabled',false);
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
            });

            function poneSemana(opc){ //opc:1 si es llamada desde el btnSemana
                if(opc === 1){
                   contenedor_secundario.find('.contenedor-tabla').remove();
                }
                tblContenidos= agenda.creaContenido();
                contenedor_secundario.append(tblContenidos);
            }

            function poneDia(){
                contenedor_secundario.find('.contenedor-tabla').remove();
                tblContenidos = dia.creaTabla();
                contenedor_secundario.append(tblContenidos);
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
            $('.dia'+i).html(dias[i] +" "+d);
        }
    }

    function actualizaCabeceraDia(d){
        $('.celcabdia').html(devuelveDia(x).format('dddd').toUpperCase());
    }

    //**************************************** PARA LA VISTA DE AGENDA **********************************************
    function vistaAgenda (datos) {
        this.creaContenido = creaContenido;
        this.ponerCuartosOcupados = ponerCuartosOcupados;

        function creaContenido() {

            var pd = primerdia(c).date();
            var html = creaTabla(pd);
            return html;
        }

        function creaTabla(primerdia) {
            var tabla = "<div class='contenedor-tabla'>" +
            " <div class='cont_tblcabecera'>" +
            creaCabeceraTbl(primerdia) +
            "</div>" +
            " <div class='cont_tblcuerpo'><div class='cont_event'></div>" +
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
                "<td class='celda"+eshoy(0)+"' id='ct"+(i+1)+"0'></td>" +
                "<td class='celda"+eshoy(1)+"' id='ct"+(i+1)+"1'></td>" +
                "<td class='celda"+eshoy(2)+"' id='ct"+(i+1)+"2'></td>" +
                "<td class='celda"+eshoy(3)+"' id='ct"+(i+1)+"3'></td>" +
                "<td class='celda"+eshoy(4)+"' id='ct"+(i+1)+"4'></td>" +
                "<td class='celda"+eshoy(5)+"' id='ct"+(i+1)+"5'></td>" +
                "<td class='celda"+eshoy(6)+"' id='ct"+(i+1)+"6'></td>" +
                "</tr>";
            }
            tbody += f + "</tbody></table>";
            return tbody;
        }

        function eshoy(i){
            var es = '';
            var hoy = moment().weekday();
            if(hoy===i){
                es = ' celhoy';
            }
            return es;
        }

        function ponerCuartosOcupados() {
            var daticos = datos.datosroom;
            for(d in daticos){
                var celda = $('.cont_tblcuerpo').find('#ct'+daticos[d].cuartonro+''+moment(daticos[d].fecha_inicia).weekday());
                if (moment(daticos[d].fecha_inicia)>=fechaInic && moment(daticos[d].fecha_inicia)<=fechaFin) {
                    var diactual = moment(daticos[d].fecha_inicia);
                    var diafinocup = moment(daticos[d].fecha_fin);
                    while (diactual <= diafinocup) {
                        remuevediv(celda);
                        celda.append(creadiv(daticos[d]));
                        diactual = moment(diactual).add('day',1);
                        celda = $('.cont_tblcuerpo').find('#ct'+daticos[d].cuartonro+''+diactual.weekday());
                    }
                }else{
                    var diactual = moment(daticos[d].fecha_inicia);
                    var diafinocup = moment(daticos[d].fecha_fin);
                    while (diactual <= diafinocup) {
                        remuevediv(celda);
                        diactual = moment(diactual).add('day',1);
                        celda = $('.cont_tblcuerpo').find('#ct'+daticos[d].cuartonro+''+diactual.weekday());
                    }

                }
            }
        }
    }

    function creadiv(datos) {
        var div = $("<div class='evento'><h5></h5><p></p></div>");
        div.css({
            border: '1px solid gray',
            borderRadius: '5px',
            boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.3)',
            backgroundColor: datos.color===undefined ? 'red':datos.color, //color rojo para ocupado
            width: '95%',
            cursor:'pointer'
            //left: left,
            //top: top
        })
        .click(function(ev){
            config_default.haceClick.call(this,datos); //el this no se recibe como parametro pero se debe enviar, datos si es parametro q se recibe
        });

        div.find('h5').html(moment(datos.fecha_inicia).hour()+':'+moment(datos.fecha_inicia).minute()+
                        ' - '+moment(datos.fecha_fin).hour()+':'+moment(datos.fecha_fin).minute());
        div.find('p').html(datos.nombre_persona);
        return div;
    }

    function remuevediv(celda){
        celda.find('div').remove();
    }


    //**************************************** PARA LA VISTA DE DIA **********************************************
    function vistaDia (datos){

        this.creaTabla= creaTabla;
        this.ponerCuartosOcupadosDia = ponerCuartosOcupadosDia;

        function creaTabla() {
            var tabla = "<div class='contenedor-tabla'>" +
            " <div class='cont_tblcabecera'>" +
            creaCabeceraTbl() +
            "</div>" +
            " <div class='cont_tblcuerpo'><div class='cont_event'></div>" +
            creaCuerpoTbl() +
            "</div>" +
            "</div>";
            return tabla;
        }

        function creaCabeceraTbl() {
            var thead;
            thead = "<table><thead>" +
            "<tr class='filasupdia'>" +
            "<th class='celcab celroom'>Rooms</th>" +
            "<th class='celcabdia'></th>" +
            "<th class='calcabvac'></th>" +
            "</tr></thead></table>";
            return thead;
        }

        function creaCuerpoTbl() {
            var tbody = "<table><tbody>";
            var f = '';
            for(var i=0 ; i <datos.num_fila;i++){
                f+="<tr class='filatbldia'> " +
                "<td class='celcab celroom'>Room "+(i+1)+"</td>" +
                "<td class='celdadia' id='ct"+(i+1)+"'></td>" +
                "</tr>";
            }
            tbody += f + "</tbody></table>";
            return tbody;
        }

        function ponerCuartosOcupadosDia(diamostrado){//objeto moment del dia mostrado
            //console.log(diamostrado.format('MMMM D'));
            var daticos = datos.datosroom;
            for (d in daticos) {
                 var celda = $('.cont_tblcuerpo').find('#ct'+daticos[d].cuartonro);
                if(mismaFecha(daticos[d].fecha_inicia,diamostrado)||mismaFecha(daticos[d].fecha_fin,diamostrado)){
                    remuevediv(celda);
                    celda.append(creadiv(daticos[d]));
                }else if(moment(diamostrado).isBefore(daticos[d].fecha_fin)//Si diamostrado es antes de fechafin y diamostrado es mayor a fecha inicial
                        &&moment(diamostrado).isAfter(daticos[d].fecha_inicia)){
                    remuevediv(celda);
                    celda.append(creadiv(daticos[d]));
                }else{
                    remuevediv(celda);
                }
            }

        }
    }
})(jQuery);
