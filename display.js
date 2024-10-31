let reset_2 = document.getElementById("reset_2");
let table_h = document.getElementById("table_h");
let table_g = document.getElementById("table_g_dis");
let table_not_g = document.getElementById("table_not_g_dis");
let div_h = document.getElementById("div_h");

div_2.style.display = 'block';
div_3.style.display = 'none';
table_not_g.style.display = 'none';

function form_of_calculate (){
    let math = document.getElementById("math").value;
    if (math === "Gready" || math === "Leo_doi"){
        div_h.style.display = 'block';
        table_not_g.style.display = 'block';
        table_g.style.display = 'none';
    }
    if(math === "UCS"){
        div_h.style.display = 'none';
        table_not_g.style.display = 'none';
        table_g.style.display = 'block';
    }
    if(math === "A*"){
        div_h.style.display = 'block';
        table_g.style.display = 'block';
        table_not_g.style.display = 'none';
    }
}
addEventListener("change", form_of_calculate);

function form_change (){
    let type_data = document.getElementById("type_of_data").value;
    if(type_data === "write" ){
        div_2.style.display = 'block';
        div_3.style.display = 'none';        
    }
    else{
        div_2.style.display = 'none';
        div_3.style.display = 'block';
    }
}
addEventListener("change", form_change);

const input_top =  document.getElementById("so_dinh");

function changeTableInput_Top () {
    let table_h = document.getElementById("table_h");
    let dinh = document.getElementById("so_dinh").value;
    table_h.innerHTML = "";
    for (let i = 0; i<dinh; i++){
        table_h.innerHTML +=
            `<tr>
                <td><input type="text" name="dinh" class="form-control"></td>
                <td><input type="number" name="khoang_cach_h" class="form-control"></td>
            </tr>`
    }       
}
// input_top.removeEventListener("change", changeTableInput_Top);
input_top.addEventListener("change", changeTableInput_Top);


const input_road =  document.getElementById("so_cung");
function changeTableInput_Road () {
    let table_g = document.getElementById("table_g");
    let table_not_g = document.getElementById("table_not_g");
    let cung = document.getElementById("so_cung").value;
    let math = document.getElementById("math").value;
    if (math === "Gready" || math === "Leo_doi"){
        table_not_g.innerHTML ="";
        for(let i = 0; i<cung; i++){
            table_not_g.innerHTML +=
                `<tr>
                    <td><input type="text" name="tu" class="form-control"></td>
                    <td><input type="text" name="den" class="form-control"></td>
                </tr>`
        }
    }
    else{
        table_g.innerHTML =""
        for(let i = 0; i<cung; i++){
            table_g.innerHTML +=
                `<tr>
                    <td><input type="text" name="tu" class="form-control"></td>
                    <td><input type="text" name="den" class="form-control"></td>
                    <td><input type="number" name="khoang_cach" class="form-control"></td>
                </tr>`
        }
    }
    
}
input_road.addEventListener("change", changeTableInput_Road);


let reset_2_click = () => {
    location.reload();
}
reset_2.addEventListener("click", reset_2_click);   