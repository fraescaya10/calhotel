;;
(function($){
    var nombrePlugin='calhotel'; 
    
    var estilos={
        cssHuesped: {
            'border': '1px solid #1E90FF',
            'border-radius':'5px',
            'box-shadow':'1px 1px 1px 1px rgba(0,0,0,0.3)',
            'width': '95%',
            'height': '95%',
            'cursor': 'pointer',
            'margin': '5px auto'
        }
    };
    var propiedades={
        lang:'es',
        rooms: [],
        datosroom: [],
        vistadef: 'semana',
        btsup: 'btn btn-default',
        btim: 'glyphicon glyphicon-arrow-right',
        txtDer: ['&laquo;','Hoy','&raquo;'],
        txtIzq: ['Semana','Dia']
    };
    var eventos={
        /*o.evento.call(this);*/
        clickHuesped: function(huesped) {},//llamado al hacer click en un div
        selectCelda: function(fecini, fecfin, cuartos) {},//llamado al seleccionar la celda
        renderHuesped: function(huesped){}//llamado despues de renderizar el huesped en cada cuarto
        
    };
    var metodos={
        init : function( opciones ) {   
            return this.each(function(){  
                /*las funciones se extienden primero*/
                o = $.extend(eventos,estilos,propiedades,opciones); 
                m = metodos;  
                /*garantiza una sola llamada por selector*/
                var data = $(this).data(nombrePlugin);  
                if(!data){  
                    codigo($(this),o,m);
                    data = $(this).data(nombrePlugin,'inicializado');  
                }  
            });  
        }        
    };
    //codigo del plugin, aqui se declaran los metodos publicos
    var codigo=function(el,o,m){
        moment.lang(o.lang);
        var self = el;
        self.c = 0; // Para suma de semanas
        self.x = 0; // Para suma de días
        self.libres = 0;
        self.vista = o.vistadef;     
        self.totcuartos = o.rooms.length;        
        self.fechaActual = moment();
        self.actualOcupados = [];
        _maquetar();
        
        //**************************** METODOS PUBLICOS ***********************
        m.anterior = function(){
            _anterior();
        };
        
        m.hoy = function(){
            _hoy();
        };
        
        m.siguiente = function(){
            _siguiente();
        };
         
        m.getVista = function(){ 
            /*puede incluir nombre, titulo, inicio, fin*/
            return self.vista; //nombre de la vista
        };
        m.cambiaVista = function(vista){ // vista -> 'dia' o 'semana'
            self.vista = vista;
            _poneVista();
        };
        m.renderOcupados = function (){
            _renderOcupados();
        };
        m.updateHuesped = function(huesped){
            _updateHuesped(huesped);
        };
        
        m.getCuartoHuesped = function(ser_codigo){
            return _getCuartoHuesped(ser_codigo);
        }
                
        //**************************** METODOS PRIVADOS ***********************
        function _maquetar(){
            self.cont_principal = _creaDiv('contenedor-principal');
            self.cont_secundario = _creaDiv('contenedor-secundario');
            self.cont_secundario.append(_botonesSup());
            self.cont_principal.append(self.cont_secundario);
            self.append(self.cont_principal);
            _poneVista();
        }
        
        function _poneVista(){
            if(self.vista === 'semana'){
                _vistaSemana();
                _callEvents();
            }else if(self.vista === 'dia'){
                _vistaDia();
                _callEvents();
            }
        }
        
        function _botonesSup(){
            var btnsCab = _creaDiv('botones-cabecera');
            var tblBtns = $("<table class='tbl-botones'></table>");
            var tr = $("<tr></tr>");
            var tdIzq = _creaTD('btns_izq');
            var tdTit = _creaTD('tit_tabla');
            var tdDer = _creaTD('btns_der');
            //Botones de la izquierda                             
            var bAnt = _creaBtn(o.btsup,'btnant',o.txtDer[0]);
            var bHoy = _creaBtn(o.btsup,'btnhoy', o.txtDer[1]);
            var bSig = _creaBtn(o.btsup, 'btnsig', o.txtDer[2]);
            bAnt.click(function(e) {
                _anterior();
            });
            bHoy.click(function(e) {
                _hoy();
            });
            bSig.click(function(e) {
                _siguiente();
            });
            //Botones de la derecha
            var bSem = _creaBtn(o.btsup,'btnSemana',o.txtIzq[0]);
            var bDia = _creaBtn(o.btsup,'btnDia', o.txtIzq[1]);
            bSem.click(function(e) {
                self.c = 0;
                self.vista = 'semana';
                _poneVista();
            });
            bDia.click(function(e) {
                self.x = 0;
                self.vista = 'dia';
                _poneVista();
            });
            //Agregando los botones
            tdIzq.append(bAnt);
            tdIzq.append(bHoy);
            tdIzq.append(bSig);
            tdDer.append(bSem);
            tdDer.append(bDia);
            tdTit.append("<h1 id='titFecha'>" + _devuelveSemana() + "</h1>");
            tr.append(tdIzq);
            tr.append(tdTit);
            tr.append(tdDer);
            tblBtns.append(tr);
            btnsCab.append(tblBtns);
            return btnsCab;
        }
        
        function _creaBtn(cls,id,txt){
            return $("<button type='button' class='"+cls+"' id='"+id+"'>"+
                        "<a>"+txt+"</a>"+
                     "</button>");
        } 
               
        function _creaDiv(cls){
            return $("<div class='"+cls+"'></div>");
        }  
              
        function _creaTD(id){
            return $("<td id='"+id+"'></td>");
        }
        
        function _devuelveSemana(){
            var fecha = _primerDiaSem();
            self.iniSem = moment(fecha).startOf('week');
            self.finSem = moment(fecha).endOf('week');
            if (self.iniSem.isSame(self.finSem, 'month')) {
                return self.iniSem.format('MMMM D') + ' - ' + self.finSem.format('D YYYY');
            } else {
                return self.iniSem.format('MMMM D') + ' - ' + self.finSem.format('MMMM D YYYY');
            }
        }
        
        function _vistaSemana(){
            self.cont_secundario.find('.contenedor-tabla').remove();
            var tblsem = _maquetarTbl(_tblCabeceraSem(), _tblCuerpoSem());
            self.cont_secundario.append(tblsem);
            $('#btnSemana').attr('disabled', true);
            $('#btnDia').attr('disabled', false);
            _actualizarTodo();
        }
        
        function _maquetarTbl(tblcab, tblcue){
            var divtbl = _creaDiv('contenedor-tabla');
            var cabecera = _creaDiv('cont_tblcabecera');
            var cuerpo = _creaDiv('cont_tblcuerpo');
            cabecera.append(tblcab);
            cuerpo.append(tblcue);
            divtbl.append(cabecera);
            divtbl.append(cuerpo);
            return divtbl;
        }
        
        function _tblCabeceraSem(){
            var tblh = $("<table></table>");
            var thead = $("<thead></thead>");
            var tr = $("<tr class='filasup'></tr>");
            var th = $("<th class='celcab celroom'></th>");
            th.html('Room');
            tr.append(th);
            for (var i = 0; i < 7; i++) {
                var h = $("<th class='celcab' id='dia" + i + "'></th>");
                tr.append(h);
            }
            
            tr.append("<th class='calcabvac'></th>");
            thead.append(tr);
            tblh.append(thead);
            return tblh;        
        }
        
        function _tblCuerpoSem(){
            var tblc = $("<table></table>");
            var tbody = $("<tbody></tbody>");
            for (var i = 0; i < self.totcuartos; i++) {
                var tr = $("<tr class='filatbl'></tr>");
                tr.attr('id', 'fila' + i);                
                var tdr = $("<td class='celcab celroom' id='r" + o.rooms[i].cuartonro + "'></td>");
                tdr.html(o.rooms[i].numdescri);
                tdr.data('cuarto',o.rooms[i]);
                tr.append(tdr);
                for (var c = 0; c < 7; c++) {
                    var tdc = $("<td class='celda'></td>");
                    tdc.attr('id', 'ct' + o.rooms[i].cuartonro + '' + c);
                    tr.append(tdc);
                }
                tbody.append(tr);
            }
            tblc.append(tbody);
            return tblc;
        }
        
        function _vistaDia(){
            self.cont_secundario.find('.contenedor-tabla').remove();
            var tbldia = _maquetarTbl(_tblCabeceraDia(), _tblCuerpoDia());
            self.cont_secundario.append(tbldia);
            $('#btnSemana').attr('disabled', false);
            $('#btnDia').attr('disabled', true);
            _actualizarTodo();
        }
        
        function _tblCabeceraDia(){
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
        }
        
        function _tblCuerpoDia(){
            var table = $("<table></table>");
            var tbody = $("<tbody></tbody>");
            for (var i = 0; i < self.totcuartos; i++) {
                var tr = $("<tr class='filatbldia'></tr>");
                tr.attr('id', 'filad' + i);
                var tdr = $("<td class='celcab celroom'id='r" + o.rooms[i].cuartonro + "'></td>");
                tdr.data('cuarto',o.rooms[i]);
                var tdc = $("<td class='celdadia'></td>");
                tdr.html(o.rooms[i].numdescri);
                tdc.attr('id', 'ct' + o.rooms[i].cuartonro);
                tr.append(tdr);
                tr.append(tdc);
                tbody.append(tr);
            }
            table.append(tbody);
            return table;
        }
        
        function _actualizarTodo(){
            _actualizaCabecerasTit();
            _desactivaHoy();
            _renderOcupados();
        }
        
        function _actualizaCabecerasTit(){
            if(self.vista === 'semana'){
                var pd = _primerDiaSem();
                for (var i = 0; i < 7; i++) {
                    var da = moment(pd).add('day', i);
                    $('#dia' + i).html(da.format('ddd ') + da.date());
                }
                $('#titFecha').text(_devuelveSemana());
            }else if (self.vista === 'dia'){
                self.diamostrado = moment(self.iniSem).add('day', self.x);
                _cabeceraDia();
            }
        }
        
        
        function _cabeceraDia(){
            $('.celcabdia').html(self.diamostrado.format('dddd').toUpperCase());
            $('#titFecha').text(self.diamostrado.format('MMMM D, YYYY'));
        }
        
        function _siguiente(){
            if(self.vista === 'semana'){
                self.c = self.c + 1;
            }else if(self.vista === 'dia'){
                self.x = self.x + 1;
            }
            _actualizarTodo();
        }
        
        function _anterior(){
            if(self.vista === 'semana'){
                self.c = self.c - 1;
            }else if(self.vista === 'dia'){
                self.x = self.x - 1;
            }
            _actualizarTodo();
        }
        
        function _hoy(){
            if(self.vista === 'semana'){
                self.c = 0;
            }else if(self.vista === 'dia'){
                self.c = 0;
                var fecha = _primerDiaSem();
                self.iniSem = moment(fecha).startOf('week');
                self.finSem = moment(fecha).endOf('week');
                self.x = self.fechaActual.weekday();
            }
            _actualizarTodo();
        }
        
        function _desactivaHoy(){
            if (self.vista === 'semana') {
                if (_esFechaEntre(self.fechaActual, self.iniSem, self.finSem)) {
                    $('#btnhoy').attr('disabled', true);
                    _colorh(self.fechaActual.weekday(),1);
                } else {
                    $('#btnhoy').attr('disabled', false);
                    _colorh(self.fechaActual.weekday(),2);
                }
            } else if (self.vista === 'dia') {
                if (_esFechaIgual(self.diamostrado, self.fechaActual)) {
                    $('#btnhoy').attr('disabled', true);
                    _colorh('',1);
                } else {
                    $('#btnhoy').attr('disabled', false);
                    _colorh('',2);
                }
            }
        }
        
        function _colorh(id, ti){
            for (var i = 0; i < self.totcuartos; i++) {
                if(ti === 1){//si es dia hoy
                    $('#ct'+ o.rooms[i].cuartonro + id).addClass('diactual');
                }else if(ti === 2){
                     $('#ct'+ o.rooms[i].cuartonro + id).removeClass('diactual');
                }
            }
        }
        
        function _esFechaIgual(f1,f2){
            var fe1 = moment(f1).format('YYYY-MM-DD');
            var fe2 = moment(f2).format('YYYY-MM-DD');
            if (moment(fe1).isSame(fe2)) {
                return true;
            } else {
                return false;
            }
        }
        
        function _esFechaEntre(fecha,fechaStart,fechaEnd){
            if ((_esDespues(fecha, fechaStart)&& _esAntes(fecha,fechaEnd)) ||
                _esFechaIgual(fecha, fechaStart) ||
                _esFechaIgual(fecha, fechaEnd)) {
                return true;
            } else {
                return false;
            }
        }
        
        function _esAntes(f1,f2){
            var fe1 = moment(f1).format('YYYY-MM-DD');
            var fe2 = moment(f2).format('YYYY-MM-DD');
            if (moment(fe1).isBefore(fe2)){
                return true;
            }else{
                return false;
            }
        }
        
        function _esDespues(f1,f2){
            var fe1 = moment(f1).format('YYYY-MM-DD');
            var fe2 = moment(f2).format('YYYY-MM-DD');
            if (moment(fe1).isAfter(fe2)){
                return true;
            }else{
                return false;
            }
        }
        
        function _primerDiaSem(){
            var fecha = moment(self.fechaActual).add('week', self.c);
            return fecha.startOf('week');
        }
                
        function _renderOcupados(){
            _removeOcupados();
            var datos = o.datosroom;
            self.actualOcupados = [];
            if(self.vista === 'semana'){
                for (i = 0; i < datos.length; i++){
                    datos[i].id = i; // se asigna un id a cada huesped
                    var celda = $('.cont_tblcuerpo').find('#ct'+datos[i].cuartonro+moment(datos[i].fecha_inicia).weekday());
                    var diainiocup = moment(datos[i].fecha_inicia);
                    var diafinocup = moment(datos[i].fecha_fin);
                    if (_esFechaEntre(diainiocup, self.iniSem, self.finSem)){
                        _renderHuespedesSemana(celda, datos[i],diainiocup,diafinocup,1);
                        self.actualOcupados.push(datos[i]);
                    }else if (_esAntes(diainiocup,self.iniSem)&& 
                              _esDespues(diafinocup,self.iniSem)){
                        diainiocup = moment(self.iniSem);
                        celda = $('.cont_tblcuerpo').find('#ct'+datos[i].cuartonro+''+diainiocup.weekday());
                        _renderHuespedesSemana(celda, datos[i],diainiocup,diafinocup,2);
                        self.actualOcupados.push(datos[i]);
                    }
                }
            }else if (self.vista === 'dia'){
                var diamos = self.diamostrado;
                for (i = 0; i < datos.length; i++){
                    datos[i].id = i;
                    var celd = $('.cont_tblcuerpo').find('#ct'+datos[i].cuartonro);
                    if (_esFechaIgual(datos[i].fecha_inicia, diamos) ||
                        _esFechaIgual(datos[i].fecha_fin, diamos)) {
                        _renderHuespedesDia(celd, datos[i],diamos,1);
                        self.actualOcupados.push(datos[i]);
                    }else if (_esAntes(diamos,datos[i].fecha_fin)&& //Si diamostrado es antes de fechafin y diamostrado es mayor a fecha inicial
                              _esDespues(diamos, datos[i].fecha_inicia)){
                        _renderHuespedesDia(celd, datos[i],diamos,2);
                        self.actualOcupados.push(datos[i]);
                    }
                }
            }
            _huespedEvents();
        }
        
        function _huespedEvents(){
            $('.evento').on('click', function(e){
                var data = $(this).data('data');
                o.clickHuesped.call(this,data);
            });
        }
        /*
         * tipo 1: cuando la fecha de inicio esta entre el iniSem y finSem
         * tipo 2: cuando la fecha de fin es posterior a iniSem y la fecha de inicio esta antes de iniSem
         * */
        function _renderHuespedesSemana(cel, huesped, fi, ff, tipo){
            var f_ini = fi;
            var f_fin = ff;
            var celda = cel;
            if (tipo===1){
                while ((_esAntes(f_ini,f_fin)||_esFechaIgual(f_ini,f_fin))&&
                        (_esAntes(f_ini, self.finSem)||_esFechaIgual(f_ini, self.finSem))){
                    if (huesped.estado !== 4 && huesped.estado !== 5 && 
                        huesped.estado!==6 && huesped.estado!==7){// si el cuarto no esta pagado o es reserva no cumplida
                        celda.append(_createHuesped(huesped,f_ini));
                    }else if (_esAntes(f_ini,self.fechaActual)&&
                              !_esFechaIgual(f_ini,self.fechaActual)){//Cualquier estado anterior al dia actual
                        celda.append(_createHuesped(huesped, f_ini));
                    }
                    f_ini = moment(f_ini).add('day',1);
                    celda = $('.cont_tblcuerpo').find('#ct'+huesped.cuartonro+''+f_ini.weekday());
                }
            }else if (tipo===2){
                while (_esAntes(f_ini,f_fin)||_esFechaIgual(f_ini, f_fin)){
                    celda.append(_createHuesped(huesped, f_ini));
                    f_ini = moment(f_ini).add('day',1);
                    celda = $('.cont_tblcuerpo').find('#ct'+huesped.cuartonro+''+f_ini.weekday());
                }
            }
        }
        
        function _renderHuespedesDia(cel,huesped,dia,tipo){
            if (tipo===1){
                if(huesped.estado!==4 && huesped.estado!==5 && huesped.estado!==6 && huesped.estado!==7){
                    cel.append(_createHuesped(huesped, dia));
                }else if(_esAntes(dia,self.fechaActual)&&
                        !_esFechaIgual(dia,self.fechaActual)){
                    cel.append(_createHuesped(huesped, dia));
                }
            }else if (tipo ===2){
                cel.append(_createHuesped(huesped, dia));
            }
        }
        
        function _createHuesped(data, dia){
            var ini = data.fecha_inicia;
            var fin = data.fecha_fin;
            var div = _creaDiv('evento');
            var cab = _creaDiv('cabevt');
            var txt = _creaDiv('txevt');
            var img = _creaDiv('imagen');
            img.append("<span class='"+o.btim+"'></span>");            
            if (_esFechaIgual(ini, fin)){
                cab.html(moment(ini).hour() + ':' + moment(ini).minute() +
                    ' - ' + moment(fin).hour() + ':' + moment(fin).minute());
                img.addClass('f_medio');
            }else if (_esAntes(dia, fin)&&
                      _esFechaIgual(dia,ini)){
                cab.html(moment(ini).hour() + ':' + moment(ini).minute());
                img.addClass('pull-left f_inicia');
            }else if (_esFechaIgual(dia,fin)){
                cab.html(moment(fin).hour() + ':' + moment(fin).minute());
                img.addClass('pull-right f_termina');
            }
            txt.append(data.nombre_persona);
            div.append(img);
            div.append(cab);
            div.append(txt);
            div.css(o.cssHuesped);
            div.data('data',data);
            div.addClass(function() {
                switch (data.estado) {
                    case 0:
                        return 'reservado'; //reservado   
                    case 1:
                        return 'ocupado'; // ocupado
                    case 2:
                    case 6:
                        return 'mantenimiento'; // mantenimiento
                    case 3:
                    case 7:
                        return 'bloqueado'; // bloqueado
                    case 4:
                        return 'pagado'; // pagado
                    case 5:
                        return 'resnocump'; // reserva no cumplida
                    default:
                        return 'reservado';
                }
            });
            o.renderHuesped.call(this,data); //llamado a renderHuesped
            return div;
        }
        
        function _updateHuesped(huesped){
            var celda = $('.cont_tblcuerpo').find('#ct'+huesped.cuartonro+moment(huesped.fecha_inicia).weekday());
            var hue = $(celda).find('.evento');
            var data = '';
            for (i = 0; i < hue.length; i++){ // por si la celda tenga mas de un evento
                if($(hue[i]).data('data').id === huesped.id ){
                    data = $(hue[i]).data('data');
                }
            }
            data.estadoasig = huesped.estadoasig;
            _renderOcupados();
        }
        
        function _removeHuesped(celda){
            $(celda).find('.evento').remove();
        }
        
        function _removeOcupados(){
            $('.evento').each(function(){
               this.remove(); 
            });
        }
        
        function _callEvents(){
            var activo = false;
            var cuarSel = [];
            if (self.vista === 'semana'){
                var celIni, celFin, siga=false;//el siga es para evitar q se seleccione las celdas q contienen huespedes
                
                $('.celda').on('mousedown', function (e){
                    e.preventDefault();
                    if ($(this).find('.evento').length) {                        
                        siga=false;
                    }else{
                        activo = true;
                        siga = true;
                        $('.marcado').removeClass('marcado'); //borramos las celdas marcadas anteriormente                        
                        $(this).addClass('marcado'); //marcamos la nueva celda
                        celIni = this;
                    }
                });
                
                $('.celda').on('mousemove', function (e){
                    if ($(this).find('.evento').length) { 
                        e.preventDefault();                       
                        siga=false;
                    }else {
                        if (activo){
                            $(this).addClass('marcado');
                        }
                    }
                });
                
                $('.celda').on('mouseup', function (e){
                    if ($(this).find('.evento').length) { 
                        e.preventDefault();                       
                        siga=false;
                    }else{
                        activo = false;
                        celFin = this;        
                        var aux = '';// para q no se repitan elementos
                        $('.marcado').each(function(i, elem){
                            var cuar = _datosCuartos(elem);
                            if(cuar !== aux){
                                cuarSel.push(cuar);
                                aux = cuar;
                            }
                        });
                        if (siga === true){
                            _callSelectCelda(celIni, celFin, cuarSel);
                        }
                        $('.marcado').removeClass('marcado');
                        cuarSel = [];
                    }
                });
                
                $('.celcab').on('mousedown', function (e){
                    $(this).addClass('marcadosup');
                });
                
                $('.celcab').on('mouseup', function (e){
                    $('.marcadosup').removeClass('marcadosup');
                    var fecha = _cellDate(this.cellIndex-1);
                    self.vista = 'dia';
                    _poneVista();
                    self.diamostrado = fecha;
                    self.x = self.diamostrado.weekday();
                    _cabeceraDia();
                    _desactivaHoy();
                    _renderOcupados();
                });
            }else if (self.vista === 'dia'){
                $('.celdadia').on("mousedown", function(ev) {
                    if ($(this).find('.evento').length) {
                        ev.preventDefault();
                    } else {
                        activo = true;
                        $('.marcado').removeClass('marcado');
                        ev.preventDefault();
                        $(this).addClass('marcado');
                    }
                });
                $('.celdadia').on("mousemove", function(ev) {
                    if ($(this).find('.evento').length) {
                        ev.preventDefault();
                    } else {
                        if (activo) {
                            $(this).addClass('marcado');
                        }
                    }
                });
                $('.celdadia').on("mouseup", function(ev) {
                    if ($(this).find('.evento').length) {
                        ev.preventDefault();
                    } else {
                        activo = false;
                        //Para cada celda con clase .marcado
                        $('.marcado').each(function(indice, elemento) {
                            cuarSel.push(_datosCuartos(this));
                        });
                        _callSelectCelda(this, this, cuarSel);
                        $('.marcado').removeClass('marcado'); // Se elimina todo lo marcado
                        cuarSel = []; // Se resetea el arreglo de cuartos
                    }
                });
            }
        }
        
        function _datosCuartos(celda){
            if(self.vista === 'semana'){
                var cuarto = parseInt(celda.id.substring(2, (celda.id.length - 1)));
                return $('#r' + cuarto).data('cuarto');
            }else if(self.vista === 'dia'){
                var cuart = parseInt(celda.id.substring(2, (celda.id.length)));
                return $('#r' + cuart).data('cuarto');
            }
        }
        
        function _callSelectCelda(celdaini, celdafin, cuartos){
            if (self.vista === 'semana'){
                var fecini = _cellDate(celdaini.cellIndex-1);// el indice de las empieza en cero pero la celda room no cuenta
                var fecfin = _cellDate(celdafin.cellIndex-1);
                if((_esDespues(fecini,self.fechaActual)&&_esFechaIgual(self.fechaActual,fecfin))||
                        _esDespues(fecfin,self.fechaActual)&&_esFechaIgual(self.fechaActual,fecini)){
                    o.selectCelda.call(self, fecini, fecfin, cuartos);
                }else if (_esFechaIgual(self.fechaActual,fecini)&&
                    _esFechaIgual(self.fechaActual,fecfin)){//si las fechas de inicio y fin coinciden con la actual
                    o.selectCelda.call(self, fecini, fecfin, cuartos);
                }else if(self.fechaActual.isBefore(fecini)&&
                        self.fechaActual.isBefore(fecfin)){// si las fechas de inicio y fin son mayores a la actual
                    o.selectCelda.call(self, fecini, fecfin, cuartos);
                }
            }else if (self.vista === 'dia'){
                if(_esFechaIgual(self.diamostrado,self.fechaActual)||
                    _esDespues(self.diamostrado,self.fechaActual)){
                    o.selectCelda.call(self, self.diamostrado, self.diamostrado, cuartos);
                }
            }
        }
        
        function _cellDate(idCelda){
            if (idCelda === 0) {
                return moment(self.iniSem);
            } else if (idCelda === 6) {
                return moment(self.finSem);
            } else {
                return moment(self.iniSem).add('day', idCelda);
            }
        }
        
        function _getCuartoHuesped(ser_codigo){
            var l = o.rooms.length;
            var room = '';
            for (var i = 0; i < l; i++){
                if(o.rooms[i].ser_codigo === ser_codigo){
                    room = o.rooms[i];
                }
            }
            return room;
        }
    };
    
    $.fn[nombrePlugin]=function(metodo){
        /*para poder llamar los métodos $(selector).plugin('metodo',valor)*/
        if (metodos[metodo]){
            return metodos[metodo].apply( this, Array.prototype.slice.call( arguments, 1 ));
        }else if ( typeof metodo === 'object' || ! metodo ) {  
            return metodos.init.apply( this, arguments );  
        } else {  
            $.error( 'Este método ' +  metodo + ' no existe en este plugin' ); 
        }
    };
})(jQuery);


