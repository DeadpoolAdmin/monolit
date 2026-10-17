const onWindowResize = () => {

    let fontSize : number = 10; // 1rem = 10px (default) 1920x1080

    let k : number = window.innerWidth / 1920;

    fontSize = fontSize * k;

    document.documentElement.style.fontSize = fontSize + "px";

}

onWindowResize()

window.addEventListener("resize", onWindowResize);
