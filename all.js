(function(p,f,h){p.Settings=function(E){this.inverted=E};p.Color=function(){};p.Color.desaturateLAB=function(E){return[E[0],E[1]/3,E[2]/3]};p.Color.LABtoXYZ=function(E){var F=0.00862068965*(E[0]+16);var J=0.95047*G(F+0.002*E[1]);var I=G(F);var H=1.08883*G(F-0.005*E[2]);return[J,I,H];function G(K){if(K>0.20689655172){return Math.pow(K,3)}else{return 0.12841854934*(K-0.13793103448)}}};p.Color.LABtoRGB=function(H){var E=p.Color.LABtoXYZ(H);var J=F(3.2406*E[0]-1.5372*E[1]-0.4986*E[2]);var I=F(-0.9689*E[0]+1.8758*E[1]+0.0415*E[2]);var K=F(0.0557*E[0]-0.204*E[1]+1.057*E[2]);J=Math.max(0,Math.min(1,J));I=Math.max(0,Math.min(1,I));K=Math.max(0,Math.min(1,K));return[J,I,K];function F(G){if(G<=0.0031308){return 12.92*G}else{return 1.055*Math.pow(G,0.41666666666)-0.055}}};p.Color.LABtoIntegerRGB=function(F){var E=p.Color.LABtoRGB(F);return[Math.round(255*E[0]),Math.round(255*E[1]),Math.round(255*E[2])]};p.Color.LABtoCSS=function(F){var E=p.Color.LABtoIntegerRGB(F);return"rgb("+E[0]+","+E[1]+","+E[2]+")"};p.Color.LCHtoLAB=function(E){var F=Math.PI*E[2]/180;return[E[0],E[1]*Math.cos(F),E[1]*Math.sin(F)]};p.LinearSpline=function(E){var F=E;this.getColorForLightness=function(H){if(H<F[0][0]||H>F[F.length-1][0]){return null}if(H==F[F.length-1][0]){return F[F.length-1]}var L=0,G=F.length-1;while(G-L>1){var I=Math.floor(L+(G-L)/2);var K=F[I][0];if(K<=H){L=I}else{G=I}}var J=(H-F[L][0])/(F[G][0]-F[L][0]);return[H,F[L][1]+J*(F[G][1]-F[L][1]),F[L][2]+J*(F[G][2]-F[L][2])]}};p.QuadraticSpline=function(M){var F=M.length;var L=M.slice();L.unshift(null);var I=E();this.getColorForLightness=function(O){if(O<L[1][0]||O>L[L.length-1][0]){return null}if(O==L[L.length-1][0]){return L[L.length-1]}var U=1,N=L.length-1;while(N-U>1){var Q=Math.floor(U+(N-U)/2);var S=L[Q][0];if(S<=O){U=Q}else{N=Q}}var R=null;var P;if(U>1){R=H(O,U-1);P=U-1}if(R===null){R=H(O,U);P=U}var T=G(R,P);return[O,T[0],T[1]]};function H(O,R){var T=I[R][0],S=I[R][1],P=I[R][2]-O,Q;if(T===0){if(S===0){return null}else{return U(-P/S)}}else{var N=S*S-4*T*P;if(N<0){return null}else{if(N==0){return U(-S/(2*T))}else{var V=Math.sqrt(N);var Q=U((-S-V)/(2*T));if(Q===null){return U((-S+V)/(2*T))}else{return Q}}}}function U(W){if((R-1)<=W&&W<=R){return W}else{return null}}}function E(){var O=[];O[1]=[(2*L[1][0]-3*L[2][0]+L[3][0])/2,(-4*L[1][0]+4*L[2][0])/2,(2*L[1][0])/2];var N;for(N=2;N<F-2;N++){O[N]=[(L[N][0]-2*L[N+1][0]+L[N+2][0])/2,(-2*N*L[N][0]+(4*N-2)*L[N+1][0]+(2-2*N)*L[N+2][0])/2,(N*N*L[N][0]+(-2*N*N+2*N+1)*L[N+1][0]+(N*N-2*N+1)*L[N+2][0])/2]}O[F-2]=[(L[F-2][0]-3*L[F-1][0]+2*L[F][0])/2,((4-2*F)*L[F-2][0]+(6*F-16)*L[F-1][0]+(12-4*F)*L[F][0])/2,((F*F-4*F+4)*L[F-2][0]+(-3*F*F+16*F-20)*L[F-1][0]+(2*F*F-12*F+18)*L[F][0])/2];return O}var K=[];var J;for(J=0;J<F+3;J++){if(J<2){K[J]=0}else{if(J>F){K[J]=F-2}else{K[J]=J-2}}}function G(V,P){var T=(K[P+3]===K[P+1]?0:(V-K[P+1])/(K[P+3]-K[P+1]));var U=(K[P+2]===K[P]?0:(V-K[P])/(K[P+2]-K[P]));var R=(1-T)*L[P+1][1]+T*L[P+2][1];var Q=(1-T)*L[P+1][2]+T*L[P+2][2];var O=(1-U)*L[P][1]+U*L[P+1][1];var N=(1-U)*L[P][2]+U*L[P+1][2];var S=(K[P+2]===K[P+1]?0:(V-K[P+1])/(K[P+2]-K[P+1]));return[(1-S)*O+S*R,(1-S)*N+S*Q]}};p.ColorMap=function(F,J,E,I){this.name=F;this.description=J;var G=E;var K=(I===2?new p.LinearSpline(E):new p.QuadraticSpline(E));this.getLABColor=function(L){return K.getColorForLightness(H(L))};this.getCSSColor=function(L){return p.Color.LABtoCSS(this.getLABColor(L))};this.getControlPoints=function(){return G};this.getSpline=function(){return K};function H(M){var L=Math.max(0,Math.min(1,M))*(G[G.length-1][0]-G[0][0]);return(p.settings.inverted?G[G.length-1][0]-L:G[0][0]+L)}};p.colorMaps={Grey:new p.ColorMap("Grey","Grey scale",[[0,0,0],[100,0,0]],2),"White-hot":new p.ColorMap("White-hot","Black-Red-Yellow-White heat colour map",[[5,0,0],[15,37,21],[25,49,37],[35,60,50],[45,72,60],[55,80,70],[65,56,73],[75,31,78],[85,9,84],[100,0,0]],3),Glow:new p.ColorMap("Glow","Black-Red-Yellow heat colour map",[[5,0,0],[15,37,21],[25,49,37],[35,60,50],[45,72,60],[55,80,70],[65,56,73],[75,31,78],[85,9,84],[98,-16,93]],3),Fern:new p.ColorMap("Fern","Colour Map along the green edge of CIELAB space",[[5,-9,5],[15,-23,20],[25,-31,31],[35,-39,39],[45,-47,47],[55,-55,55],[65,-63,63],[75,-71,71],[85,-79,79],[95,-38,90]],3),Sky:new p.ColorMap("Sky","Blue shades running vertically up the blue edge of CIELAB space",[[5,30,-52],[15,49,-80],[25,64,-105],[35,52,-103],[45,26,-87],[55,6,-72],[65,-12,-56],[75,-29,-40],[85,-44,-24],[95,-31,-9]],3),Twilight:new p.ColorMap("Twilight","Blue-Pink-Light Pink colour map",[[5,30,-52],[15,49,-80],[25,64,-105],[35,73,-105],[45,81,-88],[55,90,-71],[65,85,-55],[75,58,-38],[85,34,-23],[95,10,-7]],3),Sunrise:new p.ColorMap("Sunrise","Blue-Magenta-Orange-Yellow highly saturated colour map",[p.Color.LCHtoLAB([10,78,-60]),p.Color.LCHtoLAB([20,100,-60]),p.Color.LCHtoLAB([30,78,-40]),p.Color.LCHtoLAB([40,74,-20]),p.Color.LCHtoLAB([50,80,0]),p.Color.LCHtoLAB([60,80,20]),p.Color.LCHtoLAB([70,72,50]),p.Color.LCHtoLAB([80,84,77]),p.Color.LCHtoLAB([95,90,95])],3),Lake:new p.ColorMap("Lake","Blue-Green-Yellow-White colour map",[[15,50,-65],[35,67,-100],[45,-14,-30],[60,-55,60],[85,-10,80],[95,-17,50],[100,0,0]],3),"Morning Mist":new p.ColorMap("Morning Mist","A geographical colour map, best used with relief shading",[p.Color.LCHtoLAB([60,20,180]),p.Color.LCHtoLAB([65,30,135]),p.Color.LCHtoLAB([70,35,75]),p.Color.LCHtoLAB([75,45,85]),p.Color.LCHtoLAB([80,22,90]),[85,0,0]],3),Dawn:new p.ColorMap("Dawn","A more saturated geographical colour map, best used with relief shading",[p.Color.LCHtoLAB([65,50,135]),p.Color.LCHtoLAB([75,45,75]),p.Color.LCHtoLAB([80,45,85]),p.Color.LCHtoLAB([85,22,90]),[90,0,0]],3),Water:new p.ColorMap("Water","A water depth colour map",[p.Color.LCHtoLAB([50,35,-95]),p.Color.LCHtoLAB([60,25,-95]),p.Color.LCHtoLAB([70,25,-95]),p.Color.LCHtoLAB([80,20,-95]),[95,0,0]],3)};function j(){var E=[],F;for(F=0;F<p.numColors;F++){E.push(p.colorMap.getLABColor(F/(p.numColors-1)))}return E}p.exportIntegerCSV=function(){var E="r,g,b\r\n",H;var F=j(),G;for(H=0;H<p.numColors;H++){G=p.Color.LABtoIntegerRGB(F[H]);E+=G[0]+","+G[1]+","+G[2]+"\r\n"}return E};p.exportFloatCSV=function(){var E="r,g,b\r\n",H;var F=j(),G;for(H=0;H<p.numColors;H++){G=p.Color.LABtoRGB(F[H]);E+=G[0]+","+G[1]+","+G[2]+"\r\n"}return E};p.exportIPE=function(){var E='<ipestyle name="'+p.colorMap.name+"_ColorMap_"+p.numColors+'">\n';var G;var F=j();console.log("Colors: "+F);for(G=0;G<p.numColors;G++){color=p.Color.LABtoRGB(F[G]);E+='<color name="'+p.colorMap.name+"_"+G+'" value="'+color[0]+" "+color[1]+" "+color[2]+'"/>\n'}E+="</ipestyle>";return E};p.Preview=function(J){var E=J;this.maximize=function(){var N=f(E).parent();if(E.width!=N.width()||E.height!=N.height()-4){E.width=N.width();E.height=N.height()-4;G()}};this.draw=function(){if(E===h){alert("Canvas undefined");return}K()};var H=10;var L,M;function G(){var N,T,S=E.width;L=[];M=[];var P=[];for(T=H;T>0;T--){var Q=T/H;P[T]=0.05*Q*Q;M[T]=1-T/H}var R=[];for(N=0;N<8;N++){R.push(Math.sin(N*Math.PI/4))}for(N=0;N<S;N++){var O=N/(S-1);L[N]=[];for(T=H;T>0;T--){L[N][T]=P[T]*R[N%8]+I(O,P[T])}}}function K(){var P=E.getContext("2d"),Q=E.width,O=E.height;for(var N=0;N<Q;N++){var R=P.createLinearGradient(0,0,0,O);for(var S=H;S>0;S--){R.addColorStop(M[S],p.colorMap.getCSSColor(L[N][S]))}P.fillStyle=R;P.fillRect(N,0,1,O)}}function F(){var Q=E.getContext("2d"),X,W,P=E.width,Z=E.height;var N=Q.createImageData(P,Z);var T=[];for(W=0;W<Z;W++){var Y=(Z-W)/(Z-1);T.push(0.05*Y*Y)}var V=[];for(X=0;X<8;X++){V.push(Math.sin(X*Math.PI/4))}for(X=0;X<P;X++){var S=X/(P-1);for(W=0;W<Z;W++){var R=T[W]*V[X%8]+I(S,T[W]);var U=p.Color.LABtoIntegerRGB(p.colorMap.getLABColor(R));var O=(W*P+X)*4;N.data[O]=U[0];N.data[O+1]=U[1];N.data[O+2]=U[2];N.data[O+3]=255}}Q.putImageData(N,0,0)}function I(N,O){return O+(1-2*O)*N}};p.FixedNumPreview=function(F){var E=F;this.maximize=function(){var G=f(E).parent();E.width=G.width();E.height=G.height()-4};this.draw=function(){if(E===h){alert("Canvas undefined");return}var I=E.getContext("2d"),H,J=E.width/p.numColors,L,G;I.clearRect(0,0,E.width,E.height);if(J>1){for(H=0;H<p.numColors;H++){if(J>=10){L=Math.floor(H*J);G=Math.floor((H+1)*J)-1}else{L=H*J;G=(H+0.9)*J}var K=H/(p.numColors-1);I.fillStyle=p.colorMap.getCSSColor(K);I.fillRect(L,0,G-L,E.height)}}else{for(H=0;H<E.width;H++){var K=H/(E.width-1);I.fillStyle=p.colorMap.getCSSColor(K);I.fillRect(H,0,1,E.height)}}}};p.colorMap=p.colorMaps.Lake;p.numColors=12;var m=-128;var t=128;f(document).ready(function(){p.settings=new p.Settings(false);p.mainPreview=new p.Preview(f("#preview")[0]);p.mainPreview.maximize();p.mainPreview.draw();p.fixedNumPreview=new p.FixedNumPreview(f("#fixednum-preview")[0]);p.fixedNumPreview.maximize();p.fixedNumPreview.draw();f("#colormaps>button").each(function(){var F=p.colorMaps[this.id];if(F===p.colorMap){f(this).addClass("selected")}var I=document.createElement("canvas");var H=Math.ceil(f(this).outerWidth());I.width=H;I.height=1;if(I.getContext){var M=I.getContext("2d");var E=M.createImageData(H,1);for(var L=0;L<H;L++){var J=L/(H-1);var K=p.Color.LABtoIntegerRGB(F.getLABColor(J));var G=L*4;E.data[G]=K[0];E.data[G+1]=K[1];E.data[G+2]=K[2];E.data[G+3]=255}M.putImageData(E,0,0);this.style.backgroundImage="url("+I.toDataURL()+")"}this.title=F.description});r();l()});function l(){f(window).resize(function(){p.mainPreview.maximize();p.mainPreview.draw();p.fixedNumPreview.maximize();p.fixedNumPreview.draw()});f("#colormaps>button").click(function(){var J=p.colorMaps[this.id];if(p.colorMap!==J){u();f(this).addClass("selected");w(J)}});f("#numcolors").keydown(function(J){if(J.which===13){F()}});f("#fixednum-apply").click(function(){F()});function F(){p.numColors=f("#numcolors").val();p.fixedNumPreview.draw()}f("#download").click(function(){switch(f("#format").val()){case"csv-int":G(this,"csv","csv",p.exportIntegerCSV());break;case"csv-float":G(this,"csv","csv",p.exportFloatCSV());break;case"ipe":G(this,"plain","isy",p.exportIPE());break}});function G(M,N,O,L){if(navigator.msSaveBlob){var J=new Blob([L],{type:"text/"+N});navigator.msSaveBlob(J,"colormap."+O)}else{if("download" in M){M.href="data:text/"+N+";charset=utf-8,"+encodeURIComponent(L);M.download="colormap."+O}else{if(typeof safari!==h){var K="data:application/octet-stream;charset=utf-8,"+encodeURIComponent(L);if(!window.open(K)){if(confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")){location.href=K}}}else{}}}}f("#settings-toggle").click(function(){f("#settings").slideToggle(500);f("#settings-toggle>i").html(f("#settings-toggle>i").html()==="expand_more"?"expand_less":"expand_more")});f("#invert").click(function(){p.settings.inverted=!p.settings.inverted;p.mainPreview.draw();p.fixedNumPreview.draw();f("#colormaps>button").toggleClass("inverted")});f("#remove").click(function(){var N=q();var L=N.children("input[type=number]").first();var M=L.attr("min");var K=L.attr("max");N.prev().children("input[type=number]").first().attr("max",K);N.next().children("input[type=number]").first().attr("min",M);var J=(N.next().length?N.next():N.prev());N.remove();n(J);s()});f("#insert-before").click(function(){var M=q();var K=c(M);K[0]--;var L=(M.prev().length?B(M.prev())+1:0);var J=K[0];M.prev().children("input[type=number]").first().attr("max",K[0]-1);M.children("input[type=number]").first().attr("min",K[0]+1);var N=z(L,J);k(N,K);M.before(N);n(N);s()});f("#insert-after").click(function(){var M=q();var K=c(M);K[0]++;var L=K[0];var J=(M.next().length?B(M.next())-1:0);M.children("input[type=number]").first().attr("max",K[0]-1);M.next().children("input[type=number]").first().attr("min",K[0]+1);var N=z(L,J);k(N,K);M.after(N);n(N);s()});f("#lightness").on("input",function(){y(q(),this.value)});var E=false;f("#abControl").mousedown(function(J){E=true;I(H(this,J))}).mousemove(function(J){if(E){I(H(this,J))}}).mouseup(function(J){E=false});function H(L,N){var K=0,P=0;var M=L;while(M.offsetParent){K+=M.offsetLeft;P+=M.offsetTop;M=M.offsetParent}var J=(N.pageX-K)/L.scrollWidth;var O=(N.pageY-P)/L.scrollHeight;return[J,O]}function I(L){var K=Math.round(m+L[0]*(t-m));var J=Math.round(m+L[1]*(t-m));D(q(),K,J)}}function u(){f("#colormaps>.selected").removeClass("selected")}function r(){var H=p.colorMap.getControlPoints();for(var G=0,E=H.length;G<E;G++){var F=(G===0?0:H[G-1][0]+1);var J=(G===H.length-1?100:H[G+1][0]-1);var I=z(F,J);k(I,H[G]);f("#cp-widgets").append(I)}n(f("#cp-widgets").children().first())}function z(E,G){var F=f("<div class=control-point><input type=number min="+E+" max="+G+"> <input type=number min=-128 max=128> <input type=number min=-128 max=128></div>");F.click(function(){n(f(this))});F.children('input[type="number"]').change(function(){var I=f(this).parent();C(I);s();if(f(this).is(":first-child")){e();d();var H=parseInt(f(this).val());I.prev().children("input[type=number]").first().attr("max",H-1);I.next().children("input[type=number]").first().attr("min",H+1)}else{b()}});return F}function k(F,E){var G=f(F).children("input[type=number]");G[0].value=E[0];G[1].value=E[1];G[2].value=E[2];C(F)}function C(E){f(E).css("background-color",p.Color.LABtoCSS(c(E)))}function c(E){return f(E).children("input[type=number]").get().map(function(F){return parseInt(F.value)})}function D(G,F,E){var H=f(G).children("input[type=number]");var I=false;if(H.eq(1).val()!=F){I=true;H.eq(1).val(F)}if(H.eq(2).val()!=E){I=true;H.eq(2).val(E)}if(I){H.eq(1).trigger("change")}}function B(E){return parseInt(f(E).children("input[type=number]")[0].value)}function y(F,G){var E=f(F).children("input[type=number]").first();if(E.val()!=G){E.val(G);E.trigger("change")}}function q(){return f("#cp-widgets>.selected").first()}function n(E){q().removeClass("selected");E.addClass("selected");A();d()}function A(){e()}function e(){var G=q();var E=c(G);i(G,E);var F=f("#abBackground")[0];x(F.getContext("2d"),E[0],F.width,F.height);b()}function b(){var H=q();var I=c(H);var G=f("#abControl")[0];var F=G.getContext("2d"),E=G.width,M=G.height;F.clearRect(0,0,E,M);o(F,I,E,M);a(F,I,E,M);var L=H.children("input[type=number]").first();var J=parseInt(L.attr("min"));var K=parseInt(L.attr("max"));v(J,K,I)}function i(J,H){var F=J.children("input[type=number]").first();var I=parseInt(F.attr("min"));var E=parseInt(F.attr("max"));var G=f("#lightness").first();G.attr("min",I);G.attr("max",E);G.val(H[0]);v(I,E,H)}function v(H,M,F){var E=0.5;var G=14.5;var J=8;var L="background: linear-gradient(to right, ";for(var I=0;I<J;I++){var K=I/(J-1);L+=p.Color.LABtoCSS([H+K*(M-H),F[1],F[2]]);L+=" "+(E+K*(G-E))+"em";L+=(I==J-1?");":", ")}f("#dynamic").text("#lightness::-webkit-slider-runnable-track { "+L+" }")}function x(H,P,G,Q){var E=H.createImageData(G,Q);for(var N=0;N<G;N++){var I=N/(G-1);var M=m+I*(t-m);for(var L=0;L<Q;L++){var O=L/(Q-1);var K=m+O*(t-m);var J=p.Color.LABtoIntegerRGB([P,M,K]);var F=(L*G+N)*4;E.data[F]=J[0];E.data[F+1]=J[1];E.data[F+2]=J[2];E.data[F+3]=255}}H.putImageData(E,0,0)}function o(I,G,J,F){for(var H=0;H<=1;H+=0.01){var L=p.colorMap.getLABColor(H);var E=J*(L[1]-m)/(t-m);var K=F*(L[2]-m)/(t-m);g(I,L,G[0],0.5,E,K,4)}}function a(H,G,I,F){var E=I*(G[1]-m)/(t-m);var J=F*(G[2]-m)/(t-m);g(H,G,G[0],2,E,J,10)}function g(H,K,I,G,F,J,E){H.fillStyle=p.Color.LABtoCSS(K);H.strokeStyle=(I<70?"white":"black");H.lineWidth=G;H.beginPath();H.arc(F,J,E,0,Math.PI*2,true);H.fill();H.stroke()}function d(){var H=q();var F=H.children("input[type=number]").first();var I=parseInt(F.val());var G=parseInt(F.attr("min"));var E=parseInt(F.attr("max"));f("#insert-before").prop("disabled",I<=G);f("#insert-after").prop("disabled",I>=E);f("#remove").prop("disabled",f(".control-point").length===3)}function w(E){p.colorMap=E;p.mainPreview.draw();p.fixedNumPreview.draw();f("#cp-widgets").empty();r()}function s(){var E=f("#cp-widgets").children().get().map(c);p.colorMap=new p.ColorMap("Custom","Custom color map",E,3);u();p.mainPreview.draw();p.fixedNumPreview.draw()}}(window.ColorZebra=window.ColorZebra||{},jQuery));