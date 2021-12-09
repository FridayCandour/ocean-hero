let right = false,
left = false,
up = false,
down = false;
continuesKeys(["ArrowLeft"], ()=>{
    left = true;
})
continuesKeys(["ArrowRight"], ()=>{
    right = true;
})
continuesKeys(["ArrowUp"], ()=>{
    up = true;
})
continuesKeys(["ArrowDown"], ()=>{
    down = true;
})
