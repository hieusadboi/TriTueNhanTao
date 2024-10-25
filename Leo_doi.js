
let submit = document.getElementById("submit");
let submit1 = document.getElementById("submit1");
let type_of_data = document.getElementById("type_of_data").value;
 

function get_data_h (){
    let so_dinh = document.getElementById("so_dinh").value;
    let ds_dinh = document.getElementsByName("dinh");
    let heuristic = document.getElementsByName("khoang_cach_h");
    let h = {};
    for (let i=0; i<so_dinh; i++){
            let dinh = ds_dinh[i].value;
            h[dinh] = Number(heuristic[i].value);
    }
    return h;
}

function get_matrix (){
    let so_cung = document.getElementById("so_cung").value;
    let from = document.getElementsByName("tu");
    let to = document.getElementsByName("den");
    let h = get_data_h();
    let matrix = [];
    for (let i = 0; i< so_cung; i++ ){
        matrix[i] = {
            "from": from[i].value,
            "to": to[i].value,
            "h": h[to[i].value],
            "check": 0
        }
    }
    return matrix;
}

function find_open (matrix, start) {
    let Open_List = [];
    let j = 0;
    for (let i = 0; i< matrix.length; i++){
        if((matrix[i].from === start) && matrix[i].check === 0 ){
            Open_List[j] = matrix[i];
            j++;
        }
    }
    return Open_List;
}

function find_node_min (Open_List){
    let A = Open_List[0];
    for(let i = 1; i<Open_List.length; i++){
        if (Open_List[i].h <= A.h){
            A = Open_List[i];
        }
    }
    return A;
}

let graphObj = {};  // Biến để lưu đối tượng đồ thị

  document.getElementById('file').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const fileContent = e.target.result;
        let print_file = document.getElementById("print_file");
        print_file.innerText = fileContent;
        // Chuyển đổi nội dung tệp sang đối tượng
        graphObj = parseGraph(fileContent);
        console.log(graphObj);  // Hiển thị đối tượng trong console
      };
      reader.readAsText(file);
    } else {
      console.log('Không có tệp nào được chọn.');
    }
  });

//Hàm để chuyển đổi nội dung tệp sang đối tượng
function parseGraph(text) {
    let lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    let graph = {
      vertices: 0,
      edges: 0,
      start: '',
      end: '',
      heuristics: {},
      adjacencyList: []
    };
    
    lines.forEach((line, index) => {
      if (index === 0) {
        // Đọc số lượng đỉnh và cung
        let [vertices, edges] = line.split(' ').map(item => parseInt(item.split(' ')[0]));
        graph.vertices = vertices;
        graph.edges = edges;
      } else if (index === 1) {
        // Đọc điểm bắt đầu và kết thúc
        let [start, end] = line.split(' ').map(item => item.trim()).filter(item => item.length == 1);
        graph.start = start;
        graph.end = end;
      } else if (line.includes('H(')) {
        // Đọc giá trị heuristic
        let [node, heuristic] = line.split('= ');
        let vertex = node.match(/\(([^)]+)\)/)[1];  // Trích xuất ký tự trong ngoặc đơn
        graph.heuristics[vertex] = parseInt(heuristic);
      } else {
        // Đọc các cạnh và trọng số
        let [from, to] = line.split(' ');
        graph.adjacencyList.push({ from, to, h: graph.heuristics[to], check: 0});
      }
    });

    return graph;
}

let path;

function Leo_doi (){
  let start;
  let end;
  let table;
  let type_of_data = document.getElementById("type_of_data").value;  
  let matrix;
  path = [];
  if (type_of_data === "write"){
    table = document.getElementById("table_result1");
    start = document.getElementById("begin").value;
    end = document.getElementById("end").value;
    matrix =  get_matrix();
  }
  else{
    table = document.getElementById("table_result2");
    start = graphObj.start;
    end = graphObj.end;
    matrix = graphObj.adjacencyList;
  }    
  if (start === end){ 
      table.innerHTML += 
      `<tr>
          <td>0</td>
          <td>${start}</td>
          <td>(${start}, 0, ${end})</td>
          <td>${start}</td>
      </tr>
      `
      path.push(start);
      path.push(end);
  }
  else {
      let i = 0;
      let Open_List = find_open(matrix, start);
      let A = find_node_min(Open_List);   
      path.push(A.from);
      A.check = 1;
      while ((A.to != end || A.from != end) && Open_List.length != 0){
        console.log(Open_List);
          for (let j = 0; j<Open_List.length; j++){
              if (j === 0){
                  table.innerHTML += 
                  `<tr>
                      <td>${i+1}</td>
                      <td>(${A.from})</td>
                      <td>(${Open_List[j].from}, ${Open_List[j].h}, ${Open_List[j].to})</td>
                      <td>(${A.from})</td>
                  </tr>`
              }
              else {
                  table.innerHTML += 
                  `<tr>
                      <td></td>
                      <td></td>
                      <td>(${Open_List[j].from}, ${Open_List[j].h}, ${Open_List[j].to})</td>
                      <td></td>
                  </tr>`
              }                    
          }           
          path.push(A.to);
          Open_List = find_open(matrix, A.to);
          A = find_node_min(Open_List);
          A.check = 1;
          i++;
      }
  }
}

let submit1_click = () =>{
  let thuat_toan = document.getElementById("math").value;
  if(thuat_toan === "Leo_doi"){
    Leo_doi();
  }      
}

submit1.addEventListener("click", submit1_click);
submit.addEventListener("click", submit1_click);

let way_goal = () => {
  let thuat_toan = document.getElementById("math").value;
  if(thuat_toan === "Leo_doi"){
    let way = document.getElementById("wayToGoal");
    way.innerHTML = 
    `<p>
      <strong>Đường đi là: ${path.join(' -> ')}</strong> 
    </p>`;
  }    
}
submit1.addEventListener("click",way_goal);
submit.addEventListener("click", way_goal);