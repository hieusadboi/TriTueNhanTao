let submit = document.getElementById("submit");
let submit1 = document.getElementById("submit1");
let type_of_data = document.getElementById("type_of_data").value;


function get_data_h1 (){
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

function get_matrix1 (){
    let so_cung = document.getElementById("so_cung").value;
    let from = document.getElementsByName("tu");
    let to = document.getElementsByName("den");
    let h = get_data_h1();
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

function find_open1 (matrix, start) {
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

function find_node_min1 (Open_List, B){
    let A = B;
    console.log(A);
    for(let i = 0; i<Open_List.length; i++){
      if (Open_List[i].h <= A.h){
        A = Open_List[i];
      }
    }
    if(A.to === B.to && A.from === B.from){
      return B;
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
        graphObj = parseGraph1(fileContent);
        console.log(graphObj);  // Hiển thị đối tượng trong console
      };
      reader.readAsText(file);
    } else {
      console.log('Không có tệp nào được chọn.');
    }
  });

//Hàm để chuyển đổi nội dung tệp sang đối tượng
function parseGraph1(text) {
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

function max(a, b) {
  if(a>b) return a;
  return b;
}

function find_end_in_close1(end, close){
  for (let i = 0; i<close.length; i++){
    if (close[i].to === end || close[i].from === end){
      return true;
    }
  }
  return false;
}

let start1;
let end1;
let Close_List1;
function Leo_doi () {  
  let table;
  let type_of_data = document.getElementById("type_of_data").value;
  let matrix;
  path = [];
  
  if (type_of_data === "write") {
    table = document.getElementById("table_result1");
    start1 = document.getElementById("begin").value;
    end1 = document.getElementById("end").value;
    matrix = get_matrix1();
    var h_start = get_data_h1()[start1]; // Lấy giá trị heuristic của start từ dữ liệu nhập tay
  } else {
    table = document.getElementById("table_result2");
    start1 = graphObj.start;
    end1 = graphObj.end;
    matrix = graphObj.adjacencyList;
    var h_start = graphObj.heuristics[start1]; // Lấy giá trị heuristic của start từ file
  }
  console.log(matrix); 
  // Hiển thị đỉnh khởi tạo là đỉnh start và heuristic h của nó
  table.innerHTML += 
  `<tr>
      <td>Khởi Tạo</td>
      <td>${start1}</td>
      <td>from: ${start1}, h: ${h_start}</td>
      <td></td>
  </tr>`;
  
  if (start1 === end1) {
    path.push(start1);
    path.push(end1);
  } else {
    let i = 0;
    let Open_List = find_open1(matrix, start1);
    let A = find_node_min1(Open_List, Open_List[0]);
    path.push(A.from);
    A.check = 1;
    Close_List1 = [];
    Close_List1.push(A);
    console.log(Close_List1);

    while ((A.to != end1 && A.from != end1) && Open_List.length != 0) {      
      const openListdisplay = Open_List.map(node => 
        `From: ${node.from}, To: ${node.to}, h: ${node.h}`
      ).join("<br>");

      const closedListdisplay = Close_List1.map(node => 
        `From: ${node.from}, To: ${node.to}, h: ${node.h}`
      ).join("<br>");

      const row = `
          <tr>
              <td>${i}</td>
              <td>${A.from}</td>
              <td>${openListdisplay}</td>
              <td>${closedListdisplay}</td>
          </tr>
      `;
      table.innerHTML += row;

      path.push(A.to);
      Open_List = find_open1(matrix, A.to);
      let B = A;
      A = find_node_min1(Open_List, B);      
      if(A.to === B.to && A.from === B.from){
        const openListdisplay = Open_List.map(node => 
          `From: ${node.from}, To: ${node.to}, h: ${node.h}`
        ).join("<br>");
        const row = `
          <tr>
              <td>${i+1}</td>
              <td>${B.to}</td>
              <td>${openListdisplay}</td>
              <td></td>
          </tr>
        `;
        table.innerHTML += row;
        break;
      }
      A.check = 1;
      Close_List1.push(A);
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
    if(find_end_in_close1(end1, Close_List1)){
      way.innerHTML = 
        `<p>
          <strong>Đường đi là: ${path.join(' -> ')}</strong> 
        </p>`;
    }
    else {
      way.innerHTML = 
        `<p>
          <strong>Không có đường đi từ ${start1} đến ${end1}</strong> 
        </p>`;
    }   
    
  }    
}
submit1.addEventListener("click",way_goal);
submit.addEventListener("click", way_goal);