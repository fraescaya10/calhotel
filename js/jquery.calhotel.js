
;(function( $, window, document, undefined ){
    var CalHotel = {
        init: function( config_usuario, elem ){
            moment.lang('es');
            var self = this;
            self.$elem = $(elem);
            self.opc = $.extend( {},$.fn.calhotel.config_default,config_usuario );            
            self.c = 0;// Para suma de semanas
            self.x = 0;// Para suma de días
            self.vista = self.opc.vistadef;
            self.fechaActual = moment();
            self.maquetar();
            this.asignaEventos();
        },
        maquetar: function(){
            var self = this;
            self.cont_principal = $("<div class='contenedor-principal'></div>");
            self.cont_secundario = $("<div class='contenedor-secundario'></div>");
            self.cont_secundario.append(self.botonesSup());
            self.cont_principal.append(self.cont_secundario);
            self.$elem.append(self.cont_principal);
            if (this.vista==='semana') {
                this.vistaSemana();
            }else if (this.vista==='dia') {
                this.vistaDia();
            }
        },
        botonesSup: function(){
            var self = this;
            var btnsCab = $("<div class='botones-cabecera'></div>");
            var tblBtns = $("<table class='tbl-botones'></table>");
            var cssbtn = "text-decoration:none;";
            var clsbtn = "btn btn-default";
            var tr = $("<tr></tr>");
            var tdIzq = $("<td id='btns_izq'></td>");
            var tdTit = $("<td id='tit_tabla'></td>");
            var tdDer = $("<td id='btns_der'></td>");
            //Botones de la izquierda            
            var bAnt = $("<button type='button' class='"+clsbtn+"' id='btnant'><a style='"+cssbtn+"'>&laquo;</a></button>");
            var bHoy = $("<button type='button' class='"+clsbtn+"' id='btnhoy'><a style='"+cssbtn+"'>Hoy</a></button>");
            var bSig = $("<button type='button' class='"+clsbtn+"' id='btnsig'><a style='"+cssbtn+"'>&raquo;</a></button>");
            bAnt.click(function(e){
                self.anterior();
            });
            bHoy.click(function(e){
                self.hoy();
            });
            bSig.click(function(e){
                self.siguiente();
            });
            //Botones de la derecha
            var bSem = $("<button type='button' class='"+clsbtn+"' id='btnSemana'><a style='"+cssbtn+"'>Semana</a></button>");
            var bDia = $("<button type='button' class='"+clsbtn+"' id='btnDia'><a style='"+cssbtn+"'>Dia</a></button>");
            bSem.click(function(e){
                //~self.c=0;
                self.vista='semana';
                self.vistaSemana();
                self.asignaEventos();
            });
            bDia.click(function(e){
                self.x=0;
                self.vista='dia';
                self.vistaDia();
                self.asignaEventos();
            });
            tdIzq.append(bAnt);
            tdIzq.append(bHoy);
            tdIzq.append(bSig);
            tdDer.append(bSem);
            tdDer.append(bDia);
            tdTit.append("<h1 id='titFecha'>" + self.devuelveSemana()+ "</h1>");
            tr.append(tdIzq);
            tr.append(tdTit);
            tr.append(tdDer);
            tblBtns.append(tr);
            btnsCab.append(tblBtns);
            return btnsCab;            
        },
        devuelveSemana: function(){
            var self = this;
            var fecha = self.primerDiaSem();
            self.iniSem = moment(fecha).startOf('week');
            self.finSem = moment(fecha).endOf('week');
            if (self.iniSem.isSame(self.finSem,'month')) {
                return self.iniSem.format('MMMM D')+' - '+self.finSem.format('D'); 
            }else{
                return self.iniSem.format('MMMM D')+' - '+self.finSem.format('MMMM D');
            }
        },
        primerDiaSem : function(){
            var self = this;
            var fecha = moment(self.fechaActual).add('week', self.c);
            return fecha.startOf('week');
        },
        vistaSemana: function(){
            this.cont_secundario.find('.contenedor-tabla').remove();
            var tblsem = this.maquetarTbl(this.tblCabeceraSem(),this.tblCuerpoSem());
            this.cont_secundario.append(tblsem);
            $('#btnSemana').attr('disabled',true);
            $('#btnDia').attr('disabled',false);
            this.actualizarTodo();
        },
        tblCabeceraSem: function(){
            var tblh = $("<table></table>");
            var thead = $("<thead></thead>");
            var tr = $("<tr class='filasup'></tr>");
            var th = $("<th class='celcab celroom'></th>");
            th.html('Room');
            tr.append(th);
            for (var i=0 ; i<7; i++) {
                var h = $("<th class='celcab' id='dia"+i+"'></th>");
                tr.append(h);
            }
            thead.append(tr);
            tblh.append(thead);
            return tblh;
        },
        tblCuerpoSem: function(){
            var tblc = $("<table></table>");
            var tbody = $("<tbody></tbody>");
            for (var i=0; i<this.opc.datosroom.length;i++) {
                var tr = $("<tr class='filatbl'></tr>");
                //~tr.attr('id','fila'+i);
                var tdr= $("<td class='celcab celroom' id='r"+this.opc.datosroom[i].cuartonro+"'></td>");
                tdr.html(this.opc.datosroom[i].numdescri);
                tr.append(tdr);
                for(var c=0; c<7;c++){
                    var tdc = $("<td class='celda'></td>");
                    tdc.attr('id', 'ct'+(this.opc.datosroom[i].cuartonro)+c);
                    tr.append(tdc);
                }
                tbody.append(tr);
            }
            tblc.append(tbody);
            return tblc;
        },
        vistaDia: function(){
            this.cont_secundario.find('.contenedor-tabla').remove();
            var tbldia = this.maquetarTbl(this.tblCabeceraDia(),this.tblCuerpoDia());
            this.cont_secundario.append(tbldia);
            $('#btnSemana').attr('disabled',false);
            $('#btnDia').attr('disabled',true);
            this.actualizarTodo();
        },
        tblCabeceraDia: function(){
            var tblcab = $("<table></table>");
            var thead = $("<thead></thead>");
            var tr = $("<tr class='filasupdia'></tr>");
            var th = $("<th class='celcab celroom'></th>");
            var thd = $("<th class='celcabdia'></th>");
            var v = $("<th class='calcabvac'></th>");
            th.html('Room');
            tr.append(th);
            tr.append(thd);
            tr.append(v);
            thead.append(tr);
            tblcab.append(thead);
            return tblcab;
        },
        tblCuerpoDia: function(){
            var table = $("<table></table>");
            var tbody = $("<tbody></tbody>");
            for(var i=0 ; i <this.opc.datosroom.length;i++){
                var tr = $("<tr class='filatbldia'></tr>");
                var tdr= $("<td class='celcab celroom'id='r"+this.opc.datosroom[i].cuartonro+"'></td>");
                var tdc = $("<td class='celdadia'></td>");
                tdr.html(this.opc.datosroom[i].numdescri);
                tdc.attr('id', 'ct'+(this.opc.datosroom[i].cuartonro));
                tr.append(tdr);
                tr.append(tdc);
                tbody.append(tr);
            }
            table.append(tbody);
            return table;
        },
        maquetarTbl: function(tblcab, tblcue){
            var divtbl = $("<div class='contenedor-tabla'></div>");
            var cabecera = $("<div class='cont_tblcabecera'></div>");
            var cuerpo = $("<div class='cont_tblcuerpo'></div>");
            cabecera.append(tblcab);
            cuerpo.append(tblcue);
            divtbl.append(cabecera);
            divtbl.append(cuerpo);
            return divtbl;
        },
        actualizarTodo: function(){
            this.actualizaCabecerasTit();
            this.desactivaHoy();
            this.cuartosOcupados();
        },
        actualizaCabecerasTit: function(){
            if (this.vista==='semana') {
                var pd = this.primerDiaSem();
                for (var i=0; i<7; i++) {
                    var da = moment(pd).add('day',i);
                    $('#dia'+i).html(da.format('ddd ')+da.date());
                }
                $('#titFecha').text(this.devuelveSemana());
            }else if (this.vista==='dia') {
                this.diamostrado=moment(this.iniSem).add('day', this.x);
                $('.celcabdia').html(this.diamostrado.format('dddd').toUpperCase());
                $('#titFecha').text(this.diamostrado.format('MMMM D, YYYY'));
            }
        },
        //~devuelveDia: function(){
            //~this.diamostrado = moment(this.iniSem).add('day', this.x); 
        //~},
        siguiente: function(){
            if (this.vista === 'semana') {
                this.c=this.c+1;
            }else if (this.vista === 'dia') {
                this.x = this.x+1;
                //~console.log('Valor de x siguiente: '+this.x);
                //~if(this.x>6){
                    //~this.c=this.c+1;
                //~}
            }
            this.actualizarTodo();
        },
        anterior: function(){
            if (this.vista === 'semana') {
                this.c=this.c-1;
            }else if (this.vista === 'dia') {
                this.x = this.x-1;
                //~console.log('Valor de x anterior: '+this.x);
                //~if(this.x<0 && this.x===-1){
                    //~this.c=this.c-1;
                //~}
            }
            this.actualizarTodo();
        },
        hoy: function(){
            if (this.vista === 'semana') {
                this.c = 0;
            }else if (this.vista === 'dia') {
                // Se regresa a la primera semana
                this.c = 0; 
                var fecha = self.primerDiaSem();
                self.iniSem = moment(fecha).startOf('week');
                self.finSem = moment(fecha).endOf('week');
                //Se asigna x = 0 para q apunte a lunes
                this.x = self.fechaActual.weekday();
            }
            this.actualizarTodo();
        },
        desactivaHoy: function(){
            self = this;
            if(self.vista ==='semana'){
                if (self.esFechaIgual(self.fechaActual, self.iniSem)||
                    self.esFechaIgual(self.fechaActual, self.finSem)||
                    (self.fechaActual.isAfter(self.iniSem)&&
                     self.fechaActual.isBefore(self.finSem))) {
                    $('#btnhoy').attr('disabled',true);
                }else{
                    $('#btnhoy').attr('disabled',false);
                }
            }else if(self.vista==='dia'){
                if(self.esFechaIgual(self.diamostrado, self.fechaActual)){
                    $('#btnhoy').attr('disabled',true);
                }else{
                    $('#btnhoy').attr('disabled',false);
                }
            }
            
        },
        esFechaIgual: function(f1,f2){
            if(moment(f1).isSame(f2,'year')&&//Cuando el diainicial es igual al dia mostrado
            moment(f1).isSame(f2,'month')&&
            moment(f1).isSame(f2,'day')){
                return true;
            }else{
                return false;
            }
        },
        cuartosOcupados: function(){
            this.limpiarCuartos();
            var datos = this.opc.datosroom;
            if (this.vista === 'semana') {
                for(var d=0; d <datos.length; d++){
                    var celda = $('.cont_tblcuerpo').find('#ct'+datos[d].cuartonro+moment(datos[d].fecha_inicia).weekday());
                    var diactual = moment(datos[d].fecha_inicia);//dia actual ocupacion
                    var diafinocup = moment(datos[d].fecha_fin);//dia de fin de ocupacion
                    if ((moment(diactual).isAfter(this.iniSem)&&//Si esta despues de fechaInic -> inicio de semana mostrada y
                        moment(diactual).isBefore(this.finSem))||
                        this.esFechaIgual(diactual,this.iniSem)||
                        this.esFechaIgual(diactual, this.finSem)){// si esta antes de fechaFin -> fin de la semana mostrada
                        while ((diactual.isBefore(diafinocup) ||
                                this.esFechaIgual(diactual,diafinocup))&&
                               diactual.isBefore(this.finSem)) {
                            this.remuevediv(celda);//Nos aseguramos q el div no este ocupado
                            celda.append(this.creaDiv(datos[d], diactual));
                            diactual = moment(diactual).add('day',1);
                            celda = $('.cont_tblcuerpo').find('#ct'+datos[d].cuartonro+''+diactual.weekday());
                        }
                    }else if((moment(diafinocup).isAfter(this.iniSem) && moment(diactual).isBefore(this.iniSem))){
                        //&& moment(diafinocup).isBefore( fechaFin))){
                        diactual = moment(this.iniSem);
                        celda = $('.cont_tblcuerpo').find('#ct'+datos[d].cuartonro+''+diactual.weekday());//como actualizamos diactual entonces debemos obtener la nueva celda
                        while(diactual.isBefore(diafinocup) || this.esFechaIgual(diactual,diafinocup)){
                            this.remuevediv(celda);//Nos aseguramos q el div no este ocupado
                            celda.append(this.creaDiv(datos[d]));
                            diactual = moment(diactual).add('day',1);
                            celda = $('.cont_tblcuerpo').find('#ct'+datos[d].cuartonro+''+diactual.weekday());
                        }
                    }
                }
            }else if (this.vista === 'dia') {
                var diamostrado = self.diamostrado;
                for (var i=0; i<datos.length; i++) {
                    var celd = $('.cont_tblcuerpo').find('#ct'+datos[i].cuartonro);
                    if(this.esFechaIgual(datos[i].fecha_inicia,diamostrado)||this.esFechaIgual(datos[i].fecha_fin,diamostrado)){
                        celd.append(this.creaDiv(datos[i],diamostrado));
                    }else if(moment(diamostrado).isBefore(datos[i].fecha_fin)&&//Si diamostrado es antes de fechafin y diamostrado es mayor a fecha inicial
                        moment(diamostrado).isAfter(datos[i].fecha_inicia)){
                        celd.append(this.creaDiv(datos[i],diamostrado));
                    }
                }
            }
        },
        creaDiv: function(datos,diactual){
            var self = this;
            var div = $("<div class='evento'></div>");
            var img = $("<div class='imagen'><span class='glyphicon glyphicon-arrow-right'></span></div>");
            var h5 = $("<div class='cabevt'></div>");
            var p = $("<div class='txevt'></div>");
            if(self.esFechaIgual(datos.fecha_inicia,datos.fecha_fin)){
                img.css('color','yellow');
                h5.html(moment(datos.fecha_inicia).hour()+':'+moment(datos.fecha_inicia).minute()+
                            ' - '+moment(datos.fecha_fin).hour()+':'+moment(datos.fecha_fin).minute());
            }else if(moment(diactual).isBefore(datos.fecha_fin)){
                img.find('span').addClass('pull-left').css('color','blue');
                h5.html(moment(datos.fecha_inicia).hour()+':'+moment(datos.fecha_inicia).minute());
            }else if(this.esFechaIgual(diactual, datos.fecha_fin)){
                img.find('span').addClass('pull-right').css('color','red');
                h5.html(moment(datos.fecha_fin).hour()+':'+moment(datos.fecha_fin).minute());
            }
            p.html(datos.nombre_persona);  
            div.append(img);  
            div.append(h5);
            div.append(p);       
            div.css({
                border: '1px solid #1E90FF',
                borderRadius: '5px',
                boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.3)',
                backgroundColor: function(){
                    switch (datos.estado) {
                        case 1:                       
                            return 'green';
                        case 2:
                            return '#76E0E0';
                        case 3:
                            return 'red';
                        default:
                            return '';
                    }
                }, 
                width: '95%',
                heigth: '95%',
                cursor:'pointer'
            }).click(function(ev){
                self.opc.clickHuesped.call(this,datos);
            });
            return div;
        },
        remuevediv: function(celda){
            celda.find('div').remove();
        },
        limpiarCuartos: function(){
            //~$('.cont_tblcuerpo').find('.evento').remove();
            $('.evento').each(function(){
                this.remove();
            });
        },
        asignaEventos: function(){
            var self = this;
            if (this.vista === 'semana') {
                //Celdas cuerpo de tabla                
                var activo = false;
                var celda1, celda2;
                var cuartos = [];
                $('.cont_tblcuerpo').on( "mousedown", ".celda", function(ev) {
                    if ($(this).find('.evento').length) {
                        ev.preventDefault();
                    }else{
                        activo=true;
                        $('.marcado').removeClass('marcado');
                        ev.preventDefault();
                        $(this).addClass('marcado');
                        celda1=this;
                    }
                });
                $('.cont_tblcuerpo').on( "mousemove", ".celda", function(ev) {
                    if ($(this).find('.evento').length) {
                        ev.preventDefault();
                    }else{
                       if(activo){
                           $(this).addClass('marcado');
                       }
                    }
                });
                $('.cont_tblcuerpo').on( "mouseup", ".celda", function(ev) {
                    if ($(this).find('.evento').length) {
                        ev.preventDefault();
                    }else{
                       activo=false;
                       celda2=this;
                       //Para cada celda con clase .marcado
                       $('.marcado').each(function(indice, elemento){
                           self.llenacuartosReserv(cuartos,elemento);
                       });
                       self.activaClickCelda(celda1,celda2, cuartos);
                       $('.marcado').removeClass('marcado'); // Se elimina todo lo marcado
                       cuartos = []; // Se resetea el arreglo de cuartos
                    }
                });
                
            }else if(this.vista === 'dia'){
               var activo = false;
               var cuartos = [];
               $('.cont_tblcuerpo').on( "mousedown", ".celdadia", function(ev) {
                    if ($(this).find('.evento').length) {
                        ev.preventDefault();
                    }else{
                        activo=true;
                        $('.marcado').removeClass('marcado');
                        ev.preventDefault();
                        $(this).addClass('marcado');
                    }
                });
                $('.cont_tblcuerpo').on( "mousemove", ".celdadia", function(ev) {
                    if ($(this).find('.evento').length) {
                        ev.preventDefault();
                    }else{
                       if(activo){
                           $(this).addClass('marcado');
                       }
                    }
                });
                $('.cont_tblcuerpo').on( "mouseup", ".celdadia", function(ev) {
                    if ($(this).find('.evento').length) {
                        ev.preventDefault();
                    }else{
                       activo=false;
                       //Para cada celda con clase .marcado
                       $('.marcado').each(function(indice, elemento){
                           self.llenacuartosReserv(cuartos,elemento);
                       });
                       self.activaClickCelda(this,this, cuartos);
                       $('.marcado').removeClass('marcado'); // Se elimina todo lo marcado
                       cuartos = []; // Se resetea el arreglo de cuartos
                    }
                });
                
            }
        },
        llenacuartosReserv: function(cua, celda){
            if(this.vista === 'semana'){
                var id = parseInt(celda.id.substring(celda.id.length-1));
                var cuarto = parseInt(celda.id.substring(2,(celda.id.length-1)));
                var des_cuar = $('#r'+cuarto).html(); 
                cua.push({
                    'nro':cuarto,
                    'descripcion': des_cuar
                });
            }else if(this.vista === 'dia'){
                var cuarto = parseInt(celda.id.substring(2,(celda.id.length)));
                var des_cuar = $('#r'+cuarto).html(); 
                cua.push({
                    'nro':cuarto,
                    'descripcion': des_cuar
                });
            }
            
        },
        activaClickCelda: function(celdaini, celdafin, cuartos){
            if(this.vista==='semana'){
                //Calculo de fechas
                var idi = parseInt(celdaini.id.substring(celdaini.id.length-1));
                var fecini = this.fechaCelda(idi);
                var idf = parseInt(celdafin.id.substring(celdafin.id.length-1));
                var fecfin = this.fechaCelda(idf);
                self.opc.selectCelda.call(this,fecini,fecfin,cuartos); //verificar el envio de this como parametro en vez de celdafin
            }else if(this.vista==='dia'){
                self.opc.selectCelda.call(this,this.diamostrado,this.diamostrado,cuartos);
            }
        },
        fechaCelda: function(idCelda){
            if(this.vista==='semana'){
                var self = this;
                if(idCelda === 0){
                    return moment(self.iniSem);
                }else if( idCelda === 6){
                    return moment(self.finSem);
                }else{
                    return moment(self.iniSem).add('day', idCelda);            
                }
            }
        }
    }
    
    $.fn.calhotel = function( config_usuario ){
        return this.each(function(){
            var cal = Object.create( CalHotel );
            cal.init( config_usuario, this ); // Llamamos al metodo constructor
        });
    };
    
    $.fn.calhotel.config_default = {
        datosroom:[],
        vistadef: 'semana',
        clickHuesped: function(datos){},
        selectCelda: function(fecini,fecfin,cuartos){}
    };
    
})( jQuery, window, document );

