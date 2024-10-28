
let submit2 = document.getElementById("submit");
let submit3 = document.getElementById("submit1");
let type_of_data1 = document.getElementById("type_of_data").value;

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

function get_data_g() {
    const edges = []; // Mảng lưu trữ các cạnh
    const table = document.getElementById("table_g"); // Lấy bảng g

    // Lấy tất cả các hàng trong bảng g
    const rows = table.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName("td");
        
        if (cells.length === 3) { // Đảm bảo rằng hàng có đủ 3 ô (từ, đến, khoảng cách)
            const from = cells[0].getElementsByTagName("input")[0].value; // Lấy giá trị "từ"
            const to = cells[1].getElementsByTagName("input")[0].value; // Lấy giá trị "đến"
            const weight = parseFloat(cells[2].getElementsByTagName("input")[0].value); // Lấy trọng số

            if (from && to && !isNaN(weight)) { // Kiểm tra tính hợp lệ của dữ liệu
                edges.push({ from, to, weight }); // Thêm cạnh vào mảng
                console.log(weight)
            }
        }
    }
    return edges; // Trả về mảng các cạnh
}


function get_matrix() {
    const edges = get_data_g(); // Lấy dữ liệu g
    const h = get_data_h(); // Lấy dữ liệu h
    let matrix = [];

    for (const edge of edges) {
        const g = edge.weight; // Trọng số g từ cạnh
        const hValue = h[edge.to]; // Lấy giá trị h tương ứng với node "to"
        
        if (hValue !== undefined) { // Kiểm tra tính hợp lệ
            matrix.push({
                from: edge.from,
                to: edge.to,
                g: g,
                h: hValue,
                f: g + hValue, // Tính giá trị f
                check: 0 // Đánh dấu cho node
            });
        }
    }
    return matrix;
}

function find_open(matrix, current) {
    let openList = [];
    for (let i = 0; i < matrix.length; i++) {
        // Kiểm tra tất cả các cạnh có "from" là node hiện tại
        if (matrix[i].from === current && matrix[i].check === 0) {
            openList.push(matrix[i]);
        }
    }
    return openList;
}


function find_node_min(Open_List) {
    let minNode = Open_List[0];
    for (let i = 1; i < Open_List.length; i++) {
        // So sánh giá trị f = g + h
        if (Open_List[i].f < minNode.f) {
            minNode = Open_List[i];
        }
    }
    return minNode;
}

function update_f_g_h(node, parentNode, weight) {
    node.g = parentNode.g + weight;  // Cập nhật giá trị g đúng cách
    node.f = node.g + node.h;  // Cập nhật giá trị f
    console.log(`Updating neighbor ${node.to} with new g: ${node.g}`);
}

function print_initial_step(startNode, hValue, pt) {
    let table;
    if(pt === 0){
        table = document.getElementById("table_result1");
    } else {
        table = document.getElementById("table_result2");
    }
    
    // Tính toán giá trị f ban đầu
    let fValue = hValue !== undefined ? hValue : 0;

    // Chuẩn bị các thông tin để hiển thị
    const openListDisplay = `From: ${startNode}, g: 0, h: ${hValue}, f: ${fValue}`;

    // Tạo một hàng mới trong bảng để hiển thị
    const row = `
        <tr>
            <td>Khởi Tạo</td>
            <td></td>
            <td>${openListDisplay}</td>
            <td></td>
        </tr>
    `;

    // Thêm hàng mới vào bảng
    table.innerHTML += row;
}



function print_step_details(step, currentNode, openList, closedList, isLastStep , pt) {
    // Kiểm tra giá trị của pt để quyết định bảng nào sẽ được sử dụng
    let table;
    if (pt === 0) {
        table = document.getElementById("table_result1");
    } else {
        table = document.getElementById("table_result2");
    }

    const openListDisplay = openList.map(node => 
        `From: ${node.from}, To: ${node.to}, g: ${node.g}, h: ${node.h}, f: ${node.f}`
    ).join("<br>");

    const closedListDisplay = closedList.map(node => 
        `From: ${node.from}, To: ${node.to}, g: ${node.g}, h: ${node.h}, f: ${node.f}`
    ).join("<br>");

    // Nếu đây là bước cuối cùng và đỉnh hiện tại đã là đỉnh đích, hiển thị đỉnh "to" thay vì "from"
    const row = `
        <tr>
            <td>${step}</td>
            <td>${isLastStep === true ? currentNode.to : currentNode.from}</td>
            <td>${openListDisplay}</td>
            <td>${closedListDisplay}</td>
        </tr>
    `;

    // Thêm hàng mới vào bảng
    table.innerHTML += row;
}


function parseGraph(text) {
    // Tách văn bản đầu vào thành từng dòng và loại bỏ các dòng trống
    let lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Khởi tạo đối tượng biểu đồ
    let graph = {
        vertices: 0,
        edges: 0,
        start: '',
        end: '',
        heuristics: {}, // Để lưu giá trị heuristic của các đỉnh
        adjacencyList: [] // Danh sách kề để lưu trữ các cạnh
    };
    
    lines.forEach((line, index) => {
        if (index === 0) {
            // Đọc số lượng đỉnh và cung
            let [vertices, edges] = line.split(' ').map(item => parseInt(item.split(' ')[0]));
            graph.vertices = vertices;
            graph.edges = edges;
        } else if (index === 1) {
            // Đọc điểm bắt đầu và kết thúc
            let [start, end] = line.split(' ').map(item => item.trim()).filter(item => item.length === 1);
            graph.start = start;
            graph.end = end;
        } else if (line.includes('H(')) {
            // Đọc giá trị heuristic
            let [node, heuristic] = line.split('= ');
            let vertex = node.match(/\(([^)]+)\)/)[1];  // Trích xuất ký tự trong ngoặc đơn
            graph.heuristics[vertex] = parseInt(heuristic); // Lưu giá trị heuristic
        }else {
            // Read edges and weights
            let [from, to, g] = line.split(' ').map(item => item.trim());
            let weight = parseFloat(g); // Convert the weight to a number

            // Add the edge to the adjacency list with proper f calculation
            if (!isNaN(weight)) {
                graph.adjacencyList.push({
                    from: from,
                    to: to,
                    g: weight, // The g value is the edge weight
                    h: graph.heuristics[to], // The heuristic value of the destination node
                    f: weight + graph.heuristics[to], // Calculate f as g + h
                    check: 0
                });
            }
        }
    });

    return graph; // Trả về đối tượng biểu đồ đã được phân tích
}


let graphObj1 = {};  // Biến để lưu đối tượng đồ thị
 document.getElementById('file').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const fileContent = e.target.result;
        let print_file = document.getElementById("print_file");
        print_file.innerText = fileContent;
        // Chuyển đổi nội dung tệp sang đối tượng
        graphObj1 = parseGraph(fileContent);
        console.log("đối tượng");  // Hiển thị đối tượng trong console
        console.log(graphObj1);  // Hiển thị đối tượng trong console
      };
      reader.readAsText(file);
    } else {
      console.log('Không có tệp nào được chọn.');
    }
  });

let pt;
function astar() {
    console.log("Hàm A* đã được gọi");
    let start;
    let end;
    let table;
    let type_of_data = document.getElementById("type_of_data").value;  
    let matrix;
    let path = [];
    if (type_of_data === "write") {
        table = document.getElementById("table_result1");
        start = document.getElementById("begin").value;
        end = document.getElementById("end").value;
        matrix = get_matrix();
        h = get_data_h();
        pt = 0;
    } else {
        table = document.getElementById("table_result2");
        start = graphObj1.start;
        end = graphObj1.end;
        matrix = graphObj1.adjacencyList;
        h = graphObj1.heuristics;
        pt = 1;
    }

    const hStart = h[start];
    table.innerHTML = `
        <tr>
            <th>STT</th>
            <th>X</th>
            <th>OPEN</th>
            <th>CLOSE</th>
        </tr>
    `;

    print_initial_step(start, hStart, pt);
    console.log("Bắt đầu từ: ", start, "Kết thúc tại: ", end);

    if (start === end) {
        console.log(`Start node is the same as End node (${start}).`);
        document.getElementById("cost_result").innerHTML = 
            `<strong>Chi phí từ ${start} đến ${end} là: 0</strong>`;
        document.getElementById("wayToGoal").innerHTML = 
            `<p><strong>Đường đi là: ${start}</strong></p>`;
        return [start];
    }

    let openList = []; 
    let closedList = [];
    let isLastStep = false;

    let startNodes = matrix.filter(node => node.from === start);
    if (startNodes.length === 0) {
        console.error("Không tìm thấy đỉnh bắt đầu trong ma trận.");
        return;
    }

    openList.push(...startNodes); 
    let step = 1;

    while (openList.length > 0) {
        let currentNode = find_node_min(openList);
        console.log("Đỉnh hiện tại: ", currentNode);
    
        print_step_details(step, currentNode, openList, closedList, false, pt);
        step++;

        if (currentNode.to === end) {
            let tempNode = currentNode;
            isLastStep = true;
            
            while (tempNode) {
                path.unshift(tempNode.to);
                tempNode = tempNode.parent;
            }
            path.unshift(start);
    
            openList = openList.filter(node => node !== currentNode);
            closedList.push(currentNode);
            
            print_step_details(step, currentNode, openList, closedList, isLastStep, pt);
    
            document.getElementById("cost_result").innerHTML = 
                `<strong>Chi phí từ ${start} đến ${end} là: ${currentNode.g}</strong>`;
            break;
        }

        openList = openList.filter(node => node !== currentNode);
        closedList.push(currentNode);

        let neighbors = find_open(matrix, currentNode.to);
        for (let neighbor of neighbors) {
            let gNew = currentNode.g + neighbor.g;  // g mới cho neighbor
            let fNew = gNew + neighbor.h;  // f mới cho neighbor
        
            // Tìm nếu đã tồn tại một nút đến `neighbor.to` trong closedList với giá trị g lớn hơn
            let closedNode = closedList.find(node => node.to === neighbor.to);
            if (closedNode && gNew < closedNode.g) {
                closedList = closedList.filter(node => node.to !== neighbor.to);
                neighbor.g = gNew;
                neighbor.f = fNew;
                neighbor.parent = currentNode;
                openList.push(neighbor);
                continue;
            }
        
            // Tìm nếu đã tồn tại một nút đến `neighbor.to` trong openList với giá trị g lớn hơn
            let openNode = openList.find(node => node.to === neighbor.to);
            if (openNode) {
                if (gNew < openNode.g) {
                    openNode.g = gNew;
                    openNode.f = fNew;
                    openNode.parent = currentNode;
                }
            } else {
                // Nếu chưa tồn tại trong openList, thêm vào với g và f mới
                neighbor.g = gNew;
                neighbor.f = fNew;
                neighbor.parent = currentNode;
                openList.push(neighbor);
            }
        }
    }
    
    console.log("Đường đi: ", path);
    return path;
}

// Hàm để hiển thị đường đi
let way_goal1 = (path) => {
    let way = document.getElementById("wayToGoal");
    way.innerHTML = 
    `<p>
        <strong>Đường đi là: ${path.join(' -> ')}</strong> 
    </p>`;
};

// Hàm xử lý sự kiện cho nút submit A*
let submitAstar_click = () => {
    console.log("Nút đã được nhấn"); // Kiểm tra xem hàm có chạy không
    let thuat_toan = document.getElementById("math").value;
    
    if (thuat_toan === "A*") {
        let path = astar(); // Gọi hàm A* để tính đường đi
        way_goal1(path); // Hiển thị đường đi
    }    
};

// Đăng ký sự kiện click cho nút submit A*
submit2.addEventListener("click", submitAstar_click);
submit3.addEventListener("click", submitAstar_click);
