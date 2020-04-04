/////////////////////////////
/////////////////////////////
const SHOWDOORTEXT = true;
/////////////////////////////
/////////////////////////////
let DoorList = [];
class LaFuenteBlanca{
    drawOnScreen3D(coords, text, size){
        let screenDeets = GetScreenCoordFromWorldCoord(coords[0], coords[1], coords[2])
        let camCoords      = GetFinalRenderedCamCoord()
        let dist           = GetDistanceBetweenCoords(camCoords[0], camCoords[1], camCoords[2], coords[0], coords[1], coords[2], false)
        let scale = (size / dist) * 2
        let fov   = (1 / GetGameplayCamFov()) * 100
        scale = scale * fov;
        if (screenDeets[0]){ 
                SetTextScale(0.0 * scale, 0.55 * scale)
                SetTextFont(0)
                SetTextProportional(1)
                SetTextColour(255, 255, 255, 255)
                SetTextDropshadow(0, 0, 0, 0, 255)
                SetTextEdge(2, 0, 0, 0, 150)
                SetTextDropShadow()
                SetTextOutline()
                BeginTextCommandDisplayText('STRING')
                SetTextCentre(1)    
                AddTextComponentSubstringPlayerName(text)    
                EndTextCommandDisplayText(screenDeets[1], screenDeets[2])
        }
    }   
};
let lfbtimer = setTick(async() => {
    if( NetworkIsSessionStarted() ){
        emitNet('LFB:NISS');
        clearTick(lfbtimer);
    }
})
RegisterNetEvent("LFB:Doors")
onNet("LFB:Doors",(DList)=>{
    DoorList = DList;
    DoorList.forEach((door)=>{
        console.log(`LFBDoor: ${door.shortName} reloaded`)
    })
});
RegisterNetEvent("LFB:Denied")
onNet("LFB:Denied",(info)=>{
    emit('chat:addMessage', {
        args: [
          info
        ]
      })
});
let lfbclienttick = setTick(async() => {
    let _lfb = new LaFuenteBlanca;
    let pPed = GetPlayerPed(-1);
    let coords = GetEntityCoords(pPed);
    let zoneid = GetZoneAtCoords(coords[0],coords[1],coords[2]);
    DoorList.forEach(door => {
        if(door.zone==zoneid){   
            if (GetDistanceBetweenCoords(coords[0], coords[1], coords[2], door.coords[0], door.coords[1], door.coords[2],true) <= door.distance){
                let dObj = GetClosestObjectOfType(door.coords[0], door.coords[1], door.coords[2], 1.0, door.hashId, false, false, false);                
                if(dObj != 0){
                    SetEntityCanBeDamaged(dObj, false)
                    NetworkRequestControlOfEntity(dObj)
                    let onscreen = GetScreenCoordFromWorldCoord(door.coords[0], door.coords[1], door.coords[2]); 
                    if(door.lockState==true){
                        if(SHOWDOORTEXT==true){
                            _lfb.drawOnScreen3D(door.coords, `~r~[Locked]`, 0.4);
                        }
                        DoorSystemSetOpenRatio(door.hashId, door.lockHeading, false, true)
                        SetStateOfClosestDoorOfType(door.hashId, door.coords[0], door.coords[1], door.coords[2], true, door.lockHeading, false)
                    }
                    else{
                        if(SHOWDOORTEXT==true){
                            _lfb.drawOnScreen3D(door.coords, `~g~[Unlocked]`, 0.4);
                        }
                    }
                    FreezeEntityPosition(dObj, door.lockState)                   
                    if(IsControlJustReleased(1,70)){
                        let cd = GetStateOfClosestDoorOfType(door.hashId, door.coords[0], door.coords[1], door.coords[2])
                        emitNet('LFB:ReqState', [door, cd])
                    }
                }
            }
        }
    });
})