(function(b,c,d){b.Color=function(){};b.Color.desaturateLAB=function(f){return[f[0],f[1]/3,f[2]/3]};b.Color.LABtoXYZ=function(f){var g=0.00862068965*(f[0]+16);var k=0.95047*h(g+0.002*f[1]);var j=h(g);var i=1.08883*h(g-0.005*f[2]);return[k,j,i];function h(l){if(l>0.20689655172){return Math.pow(l,3)}else{return 0.12841854934*(l-0.13793103448)}}};b.Color.LABtoRGB=function(h){var f=b.Color.LABtoXYZ(h);var j=g(3.2406*f[0]-1.5372*f[1]-0.4986*f[2]);var i=g(-0.9689*f[0]+1.8758*f[1]+0.0415*f[2]);var k=g(0.0557*f[0]-0.204*f[1]+1.057*f[2]);j=Math.max(0,Math.min(1,j));i=Math.max(0,Math.min(1,i));k=Math.max(0,Math.min(1,k));return[j,i,k];function g(l){if(l<=0.0031308){return 12.92*l}else{return 1.055*Math.pow(l,0.41666666666)-0.055}}};b.Color.LABtoIntegerRGB=function(g){var f=b.Color.LABtoRGB(g);return[Math.round(255*f[0]),Math.round(255*f[1]),Math.round(255*f[2])]};b.Color.LABtoCSS=function(g){var f=b.Color.LABtoIntegerRGB(g);return"rgb("+f[0]+","+f[1]+","+f[2]+")"};b.Color.LCHtoLAB=function(f,j,i){var g=Math.PI*i/180;return[f,j*Math.cos(g),j*Math.sin(g)]};b.Color.testLABtoRGB=function(){var f=[[59.653,37.295,-58.801],[43.843,50.226,-75.636],[37.15,37.831,-75.353],[72.702,-68.674,51.87],[65.978,7.656,-52.21],[11.76,26.804,-20.84],[34.274,67.411,-86.313],[53.807,79.294,-27.645],[82.057,-66.64,65.042],[53.738,70.077,48.852],[0,0,0],[100,-0,-0.009],[53.239,80.09,67.201],[87.735,-86.183,83.18],[32.299,79.191,-107.865],[97.139,-21.558,94.477],[60.324,98.235,-60.835],[91.114,-48.083,-14.139]];var m=[[0.36487,0.2774,0.92234],[0.22254,0.1373,0.77817],[0.14461,0.09619,0.63378],[0.234647,0.44712,0.1405],[0.35776,0.35296,0.98688],[0.02389,0.0137,0.04413],[0.17437,0.0814,0.7046],[0.41784,0.21793,0.44123],[0.34312,0.60403,0.15319],[0.38726,0.21729,0.04951],[0,0,0],[0.95047,1,1.08897],[0.41242,0.21266,0.01933],[0.35758,0.71516,0.11919],[0.18046,0.07219,0.95044],[0.77,0.92781,0.13853],[0.59289,0.28484,0.96978],[0.53804,0.78734,1.06964]];var l=[[148,125,248],[98,77,232],[15,73,212],[10,206,75],[99,161,254],[52,14,60],[84,30,223],[231,41,178],[92,232,68],[243,52,48],[0,0,0],[255,255,255],[255,0,0],[0,255,0],[0,0,255],[255,255,0],[255,0,255],[0,255,255]];var g=0;console.log("Testing XYZ color conversions.");for(var h=0,n=f.length;h<n;h++){var j=m[h];var k=new b.Color(f[h]);var p=k.toXYZ();if(o(j[0])===o(p[0])&&o(j[1])===o(p[1])&&o(j[2])===o(p[2])){g++}else{console.log("Test "+h+" failed: Color "+f[h]+" converted to "+p+", where "+j+" was expected.")}}console.log(g+" tests passed.");console.log("");console.log("Testing RGB color conversions.");var g=0;for(var h=0,n=f.length;h<n;h++){var j=l[h];var p=b.Color.LABtoIntegerRGB(f[h]);if(j[0]===p[0]&&j[1]===p[1]&&j[2]===p[2]){g++}else{console.log("Test "+h+" failed: Color "+f[h]+" converted to "+p+", where "+j+" was expected.")}}console.log(g+" tests passed.");function o(i){return Math.round(10000*i)/10000}};b.Color.testLCHtoLAB=function(){var j=[[30,89,-59],[90,89,96]];var l=[[30,45.8384,-76.2879],[90,-9.303,88.5124]];var n=0;console.log("Testing LCH to LAB color conversions.");for(var k=0,g=j.length;k<g;k++){var m=l[k];var f=b.Color.LCHtoLAB(j[k][0],j[k][1],j[k][2]);if(h(m[0])===h(f[0])&&h(m[1])===h(f[1])&&h(m[2])===h(f[2])){n++}else{console.log("Test "+k+" failed: Color "+j[k]+" converted to "+f+", where "+m+" was expected.")}}console.log(n+" tests passed.");function h(i){return Math.round(10000*i)/10000}};b.LinearSpline=function(f){var g=f;this.getColorForLightness=function(i){if(i<g[0][0]||i>g[g.length-1][0]){return null}if(i==g[g.length-1][0]){return g[g.length-1]}var n=0,h=g.length-1;while(h-n>1){var j=Math.floor(n+(h-n)/2);var m=g[j][0];if(m<=i){n=j}else{h=j}}var k=(i-g[n][0])/(g[h][0]-g[n][0]);return[i,g[n][1]+k*(g[h][1]-g[n][1]),g[n][2]+k*(g[h][2]-g[n][2])]}};b.QuadraticSpline=function(p){var g=p.length;var o=p.slice();o.unshift(null);var j=f();this.getColorForLightness=function(n){if(n<o[1][0]||n>o[o.length-1][0]){return null}if(n==o[o.length-1][0]){return o[o.length-1]}var v=1,k=o.length-1;while(k-v>1){var r=Math.floor(v+(k-v)/2);var t=o[r][0];if(t<=n){v=r}else{k=r}}var s=null;var q;if(v>1){s=i(n,v-1);q=v-1}if(s===null){s=i(n,v);q=v}var u=h(s,q);return[n,u[0],u[1]]};function i(n,s){var u=j[s][0],t=j[s][1],q=j[s][2]-n,r;if(u===0){if(t===0){return null}else{return v(-q/t)}}else{var k=t*t-4*u*q;if(k<0){return null}else{if(k==0){return v(-t/(2*u))}else{var w=Math.sqrt(k);var r=v((-t-w)/(2*u));if(r===null){return v((-t+w)/(2*u))}else{return r}}}}function v(x){if((s-1)<=x&&x<=s){return x}else{return null}}}function f(){var n=[];n[1]=[(2*o[1][0]-3*o[2][0]+o[3][0])/2,(-4*o[1][0]+4*o[2][0])/2,(2*o[1][0])/2];var k;for(k=2;k<g-2;k++){n[k]=[(o[k][0]-2*o[k+1][0]+o[k+2][0])/2,(-2*k*o[k][0]+(4*k-2)*o[k+1][0]+(2-2*k)*o[k+2][0])/2,(k*k*o[k][0]+(-2*k*k+2*k+1)*o[k+1][0]+(k*k-2*k+1)*o[k+2][0])/2]}n[g-2]=[(o[g-2][0]-3*o[g-1][0]+2*o[g][0])/2,((4-2*g)*o[g-2][0]+(6*g-16)*o[g-1][0]+(12-4*g)*o[g][0])/2,((g*g-4*g+4)*o[g-2][0]+(-3*g*g+16*g-20)*o[g-1][0]+(2*g*g-12*g+18)*o[g][0])/2];return n}var m=[];var l;for(l=0;l<g+3;l++){if(l<2){m[l]=0}else{if(l>g){m[l]=g-2}else{m[l]=l-2}}}function h(y,r){var w=(m[r+3]===m[r+1]?0:(y-m[r+1])/(m[r+3]-m[r+1]));var x=(m[r+2]===m[r]?0:(y-m[r])/(m[r+2]-m[r]));var u=(1-w)*o[r+1][1]+w*o[r+2][1];var s=(1-w)*o[r+1][2]+w*o[r+2][2];var q=(1-x)*o[r][1]+x*o[r+1][1];var n=(1-x)*o[r][2]+x*o[r+1][2];var v=(m[r+2]===m[r+1]?0:(y-m[r+1])/(m[r+2]-m[r+1]));return[(1-v)*q+v*u,(1-v)*n+v*s]}};b.ColorMap=function(g,k,f,j){this.name=g;this.description=k;var h=f;var l=(j===2?new b.LinearSpline(f):new b.QuadraticSpline(f));this.getLABColor=function(m){return l.getColorForLightness(i(m))};this.getCSSColor=function(m){return b.Color.LABtoCSS(this.getLABColor(m))};function i(m){return h[0][0]+m*(h[h.length-1][0]-h[0][0])}};b.colorMaps={Grey:new b.ColorMap("Grey","Grey scale",[[0,0,0],[100,0,0]],2),"White-hot":new b.ColorMap("White-hot","Black-Red-Yellow-White heat colour map",[[5,0,0],[15,37,21],[25,49,37],[35,60,50],[45,72,60],[55,80,70],[65,56,73],[75,31,78],[85,9,84],[100,0,0]],3),Glow:new b.ColorMap("Glow","Black-Red-Yellow heat colour map",[[5,0,0],[15,37,21],[25,49,37],[35,60,50],[45,72,60],[55,80,70],[65,56,73],[75,31,78],[85,9,84],[98,-16,93]],3),Fern:new b.ColorMap("Fern","Colour Map along the green edge of CIELAB space",[[5,-9,5],[15,-23,20],[25,-31,31],[35,-39,39],[45,-47,47],[55,-55,55],[65,-63,63],[75,-71,71],[85,-79,79],[95,-38,90]],3),Sky:new b.ColorMap("Sky","Blue shades running vertically up the blue edge of CIELAB space",[[5,30,-52],[15,49,-80],[25,64,-105],[35,52,-103],[45,26,-87],[55,6,-72],[65,-12,-56],[75,-29,-40],[85,-44,-24],[95,-31,-9]],3),Twilight:new b.ColorMap("Twilight","Blue-Pink-Light Pink colour map",[[5,30,-52],[15,49,-80],[25,64,-105],[35,73,-105],[45,81,-88],[55,90,-71],[65,85,-55],[75,58,-38],[85,34,-23],[95,10,-7]],3),Sunrise:new b.ColorMap("Sunrise","Blue-Magenta-Orange-Yellow highly saturated colour map",[b.Color.LCHtoLAB(10,78,-60),b.Color.LCHtoLAB(20,100,-60),b.Color.LCHtoLAB(30,78,-40),b.Color.LCHtoLAB(40,74,-20),b.Color.LCHtoLAB(50,80,0),b.Color.LCHtoLAB(60,80,20),b.Color.LCHtoLAB(70,72,50),b.Color.LCHtoLAB(80,84,77),b.Color.LCHtoLAB(95,90,95)],3),Lake:new b.ColorMap("Lake","Blue-Green-Yellow-White colour map",[[15,50,-65],[35,67,-100],[45,-14,-30],[60,-55,60],[85,-10,80],[95,-17,50],[100,0,0]],3),"Morning Mist":new b.ColorMap("Morning Mist","A geographical colour map, best used with relief shading",[b.Color.LCHtoLAB(60,20,180),b.Color.LCHtoLAB(65,30,135),b.Color.LCHtoLAB(70,35,75),b.Color.LCHtoLAB(75,45,85),b.Color.LCHtoLAB(80,22,90),[85,0,0]],3),Dawn:new b.ColorMap("Dawn","A more saturated geographical colour map, best used with relief shading",[b.Color.LCHtoLAB(65,50,135),b.Color.LCHtoLAB(75,45,75),b.Color.LCHtoLAB(80,45,85),b.Color.LCHtoLAB(85,22,90),[90,0,0]],3),Water:new b.ColorMap("Water","A water depth colour map",[b.Color.LCHtoLAB(50,35,-95),b.Color.LCHtoLAB(60,25,-95),b.Color.LCHtoLAB(70,25,-95),b.Color.LCHtoLAB(80,20,-95),[95,0,0]],3)};function e(){var f=[],g;for(g=0;g<b.numColors;g++){f.push(b.colorMap.getLABColor(g/(b.numColors-1)))}return f}b.exportIntegerCSV=function(){var f="r,g,b\r\n",j;var g=e(),h;for(j=0;j<b.numColors;j++){h=b.Color.LABtoIntegerRGB(g[j]);f+=h[0]+","+h[1]+","+h[2]+"\r\n"}return f};b.exportFloatCSV=function(){var f="r,g,b\r\n",j;var g=e(),h;for(j=0;j<b.numColors;j++){h=b.Color.LABtoRGB(g[j]);f+=h[0]+","+h[1]+","+h[2]+"\r\n"}return f};b.exportIPE=function(){var f='<ipestyle name="'+b.colorMap.name+"_ColorMap_"+b.numColors+'">\n';var h;var g=e();console.log("Colors: "+g);for(h=0;h<b.numColors;h++){color=b.Color.LABtoRGB(g[h]);f+='<color name="'+b.colorMap.name+"_"+h+'" value="'+color[0]+" "+color[1]+" "+color[2]+'"/>\n'}f+="</ipestyle>";return f};b.CMapDrawer=function(j,g){var i=j;var h=g;var f=true;this.setDesaturate=function(l){f=l};this.draw=function(){if(i===d){alert("Canvas undefined");return}var n=i.getContext("2d"),m,o=i.width,l=i.height;for(m=0;m<o;m++){var p=m/(o-1);n.fillStyle=k(p);n.fillRect(m,0,1,l)}};function k(m){var l=h.getLABColor(m);if(f){l=b.Color.desaturateLAB(l)}return b.Color.LABtoCSS(l)}};b.Preview=function(k){var f=k;this.maximize=function(){var o=c(f).parent();if(f.width!=o.width()||f.height!=o.height()-4){f.width=o.width();f.height=o.height()-4;h()}};this.draw=function(){if(f===d){alert("Canvas undefined");return}l()};var i=10;var m,n;function h(){var o,v,u=f.width;m=[];n=[];var r=[];for(v=i;v>0;v--){var s=v/i;r[v]=0.05*s*s;n[v]=1-v/i}var t=[];for(o=0;o<8;o++){t.push(Math.sin(o*Math.PI/4))}var q=0;var p=1/(u-1);for(o=0;o<u;o++){m[o]=[];for(v=i;v>0;v--){m[o][v]=r[v]*t[o%8]+j(q,r[v])}q+=p}}function l(){var q=f.getContext("2d"),p,t,r=f.width,o=f.height;for(p=0;p<r;p++){var s=q.createLinearGradient(0,0,0,o);for(t=i;t>0;t--){s.addColorStop(n[t],b.colorMap.getCSSColor(m[p][t]))}q.fillStyle=s;q.fillRect(p,0,1,o)}}function g(){var r=f.getContext("2d"),A,z,q=f.width,C=f.height;var o=r.createImageData(q,C);var u=[];for(z=0;z<C;z++){var B=(C-z)/(C-1);u.push(0.05*B*B)}var w=[];for(A=0;A<8;A++){w.push(Math.sin(A*Math.PI/4))}for(A=0;A<q;A++){var t=A/(q-1);for(z=0;z<C;z++){var s=u[z]*w[A%8]+j(t,u[z]);var v=b.Color.LABtoIntegerRGB(b.colorMap.getLABColor(s));var p=(z*q+A)*4;o.data[p]=v[0];o.data[p+1]=v[1];o.data[p+2]=v[2];o.data[p+3]=255}}r.putImageData(o,0,0)}function j(o,p){return p+(1-2*p)*o}};b.FixedNumPreview=function(g){var f=g;this.maximize=function(){var h=c(f).parent();f.width=h.width();f.height=h.height()-4};this.draw=function(){if(f===d){alert("Canvas undefined");return}var k=f.getContext("2d"),j,l=f.width/b.numColors,n,h;k.clearRect(0,0,f.width,f.height);if(l>1){for(j=0;j<b.numColors;j++){if(l>=10){n=Math.floor(j*l);h=Math.floor((j+1)*l)-1}else{n=j*l;h=(j+0.9)*l}var m=j/(b.numColors-1);k.fillStyle=b.colorMap.getCSSColor(m);k.fillRect(n,0,h-n,f.height)}}else{for(j=0;j<f.width;j++){var m=j/(f.width-1);k.fillStyle=b.colorMap.getCSSColor(m);k.fillRect(j,0,1,f.height)}}}};b.colorMap=b.colorMaps.Lake;b.numColors=12;function a(){c("#colormaps>canvas").click(function(){var j=b.colorMaps[this.id];if(b.colorMap!==j){j.canvas.setDesaturate(false);j.canvas.draw();c("#colormaps>.selected").removeClass("selected");c(this).addClass("selected");b.colorMap.canvas.setDesaturate(true);b.colorMap.canvas.draw();b.colorMap=j;b.mainPreview.draw();b.fixedNumPreview.draw()}}).hover(function(){i(this)},function(){h(this)}).focus(function(){i(this)}).blur(function(){h(this)}).keydown(function(k){var j=k.which;if((j===13)||(j===32)){c(this).click();return false}});function i(k){var j=b.colorMaps[k.id].canvas;j.setDesaturate(false);j.draw()}function h(k){var j=b.colorMaps[k.id];if(b.colorMap!==j){j.canvas.setDesaturate(true);j.canvas.draw()}}c("#numcolors").keydown(function(j){if(j.which===13){f()}});c("#fixednum-apply").click(function(){f()});function f(){b.numColors=c("#numcolors").val();b.fixedNumPreview.draw()}c("#download").click(function(){switch(c("#format").val()){case"csv-int":g(this,"csv","csv",b.exportIntegerCSV());break;case"csv-float":g(this,"csv","csv",b.exportFloatCSV());break;case"ipe":g(this,"plain","isy",b.exportIPE());break}});function g(m,n,o,l){if(navigator.msSaveBlob){var j=new Blob([l],{type:"text/"+n});navigator.msSaveBlob(j,"colormap."+o)}else{if("download" in m){m.href="data:text/"+n+";charset=utf-8,"+encodeURIComponent(l);m.download="colormap."+o}else{if(typeof safari!==d){var k="data:application/octet-stream;charset=utf-8,"+encodeURIComponent(l);if(!window.open(k)){if(confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")){location.href=k}}}else{}}}}c(window).resize(function(){b.mainPreview.maximize();b.mainPreview.draw();b.fixedNumPreview.maximize();b.fixedNumPreview.draw()})}c(document).ready(function(){b.mainPreview=new b.Preview(c("#preview")[0]);b.mainPreview.maximize();b.mainPreview.draw();b.fixedNumPreview=new b.FixedNumPreview(c("#fixednum-preview")[0]);b.fixedNumPreview.maximize();b.fixedNumPreview.draw();c("#colormaps>canvas").each(function(){var f=b.colorMaps[this.id];f.canvas=new b.CMapDrawer(this,f);if(f===b.colorMap){f.canvas.setDesaturate(false);c(this).addClass("selected")}f.canvas.draw();this.title=f.description});a()})}(window.ColorZebra=window.ColorZebra||{},jQuery));