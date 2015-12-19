function MonoBehaviour() {
    var t = this;
    var startTime = createjs.Ticker.getTime(true);
    
    this.Update = function() {};
    this.Time = function() {
        return (createjs.Ticker.getTime(true) - startTime)*0.001;
    }
    
    function doUpdate(e) { if(!e.paused) t.Update() };
    createjs.Ticker.addEventListener("tick", doUpdate);
    
    this.Destroy = function() {
        // Got to clear all
        createjs.Ticker.removeEventListener("tick", doUpdate);
    }
}