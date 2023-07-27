// Var
let running = false;

// Function
function generate() {
    const chars = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890".split("");
    let random = [];
    for (let i = 0; i < 16; i++) random.push(Math.floor(Math.random() * chars.length));
    check(random.map(x => chars[x]).join(""));
}

function check(code) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4) {
            if(xhr.status === 200 || xhr.status === 204) {
                addResult(code, "Valid");
            } else if(xhr.status === 429){
                let response = JSON.parse(xhr.responseText)
                let retryAfter = response.retry_after * 1000;
                setTimeout(function() {
                    addResult(code, "Rate Limited");
                }, retryAfter);
            } else {
                addResult(code, "Invalid");
            }
        }
    }
    xhr.open("GET", `https://discord.com/api/v9/entitlements/gift-codes/${code}`);
    xhr.send();
}

function addResult(code, status) {
    document.getElementById("result").value += `${code} = ${status}\n`;
    loopGenerate();
}

function loopGenerate() {
    if(running) {
        generate();
    }
}

// Event
document.getElementById("start").addEventListener("click", function() {
    running = true;
    generate();
});

document.getElementById("stop").addEventListener("click", function() {
    running = false;
});