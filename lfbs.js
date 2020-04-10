// tp 1387.103 1139.903 114.334 0
let PlayerIds = [];
let Doors = [];
let Keys = [];
class PlayerIdentifier {
    constructor(player) {
        let playerName = GetPlayerName(player);
        this.steamid = null;
        this.license = null;
        this.discord = null;
        this.xbl = null;
        this.liveid = null;
        this.fivem = null;
        this.redm = null;
        this.ip = null;
        this.permissionNodes = [];
        this.name = playerName;
        const numPlayerIdentifiers = GetNumPlayerIdentifiers(player);
        for (let i = 0; i < numPlayerIdentifiers; i++) {
            let identifier = GetPlayerIdentifier(player, i);
            if (identifier.includes('license:')) { this.license = identifier; }
            else if (identifier.includes('steam:')) { this.steamid = identifier; }
            else if (identifier.includes('discord:')) { this.discord = identifier; }
            else if (identifier.includes('xbl:')) { this.xbl = identifier; }
            else if (identifier.includes('live:')) { this.liveid = identifier; }
            else if (identifier.includes('ip:')) { this.ip = identifier; }
            else if (identifier.includes('fivem:')) { this.fivem = identifier; }
            else if (identifier.includes('redm:')) { this.redm = identifier; }
        }
    }
};
class LaFuenteBlanca {
    Load(){
        let jLoad = LoadResourceFile(GetCurrentResourceName(), `doors.json`);
        let jData = JSON.parse(jLoad)
        Keys = [];
        jData.forEach(keyholder => {
            Keys.push(keyholder)            
        });
    }
    Save(){   
        let jData = JSON.stringify(Keys);
        let jSave = SaveResourceFile(GetCurrentResourceName(), `doors.json`, jData, -1)
        if(jSave==true){
            console.log(`Keys Saved`)
        }else{            
            console.log(`Keys Not Saved, something went wrong`)
        }
    }
    addDoorKey(license, rank, ids){
        Keys.push({license:license, rank: rank, ids: ids})
        this.Save();
    }
    removeDoorKey(license){
        let kIndex = Keys.map(function(keyholder) { return keyholder.license; }).indexOf(license);
        Keys.splice(kIndex, 1);
        this.Save();
    }
};
onNet("LFB:NISS",()=>{
    let _lfb = new LaFuenteBlanca;
    PlayerIds[global.source]= new PlayerIdentifier(global.source);
    emitNet('LFB:Doors', -1, Doors)
});
on('playerDropped', function(reason){
    let removeIndex = PlayerIds.map(function(PlayerIds) { return PlayerIds.license; }).indexOf(PlayerIds[global.source].license);        
    PlayerIds.splice(removeIndex, 1);
});
onNet("LFB:ReqState",(door)=>{
    let _lfb = new LaFuenteBlanca;
    let doorIndex = Doors.map(function(DI) { return DI.shortName; }).indexOf(door[0].shortName);
    let doorRankNeeded = Doors[doorIndex].canUseRank;
    let doorKeyIndex = Keys.map(function(usr) { return usr.license; }).indexOf(PlayerIds[global.source].license)
    let usrRank = Keys[doorKeyIndex].rank;
    if(usrRank>=doorRankNeeded){
        if(Doors[doorIndex].lockState==true){
            Doors[doorIndex].lockState=false;
            Doors[doorIndex].lockHeading = door[1][1];
            console.log(`[${global.source}] ${PlayerIds[global.source].name} Unlocked ${door[0].shortName}`)
        }
        else{
            Doors[doorIndex].lockState=true;
            console.log(`[${global.source}] ${PlayerIds[global.source].name} Locked ${door[0].shortName}`)
        }
        emitNet('LFB:Doors', -1, Doors)
    }
    else{
        console.log(`${PlayerIds[global.source].name} was denied ${door[0].shortName}`)
        emitNet('LFB:Denied', global.source, `Denied permission to (Un)Lock ${door[0].shortName}`)        
    }
});
on('onResourceStart', function(resource){
        if (GetCurrentResourceName() != resource) { return; }
        else { 
            let _lfb = new LaFuenteBlanca;
            _lfb.Load();
        }
});
RegisterCommand('reload_keys', function(source, args, rawCommand){
    let _lfb = new LaFuenteBlanca;
    if (source < 1){
       _lfb.Load();
    }
    else{
        emitNet('LFB:Denied', source, 'This command must be run from rcon.')
    }
}, false)
RegisterCommand('add_key', function(source, args, rawCommand){
    let _lfb = new LaFuenteBlanca;
    if (source < 1){
        if(args[0]!=null){
            let pID = Number(args[0]);
            if(args[1]!=null){
                let pRank = Number(args[1]);
                let tarIds = new PlayerIdentifier(Number(args[0]))
                _lfb.addDoorKey(tarIds.license, pRank, tarIds)
                emitNet('LFB:Denied', pID, 'La Fuente Blanca Keys Added');
            }
            else{
                console.log(`You did NOT include a rank (Number) from 0-2`);
            }
        }
        else{
            console.log(`You did NOT include a playerid (Number) to target`);
        }
    }
    else{
        emitNet('LFB:Denied', source, 'This command must be run from rcon.')
    }
}, false)
RegisterCommand('del_key', function(source, args, rawCommand){
    let _lfb = new LaFuenteBlanca;
    if (source < 1){
        if(args[0]!=null){
            let pID = Number(args[0]);
            let tarIds = new PlayerIdentifier(Number(args[0]))
            _lfb.removeDoorKey(tarIds.license);
            emitNet('LFB:Denied', pID, 'La Fuente Blanca Keys Removed');
        }
        else{
            console.log(`You did NOT include a playerid (Number) to target`);
        }
    }
    else{
        emitNet('LFB:Denied', source, 'This command must be run from rcon.');
    }
}, false)
RegisterCommand('lfbspawn', function(source, args, rawCommand){
    emitNet('LFB:Denied', source, 'La Fuente Blanca Spawn Pos: 1387.103 1139.903 114.334 0');
}, false)
let lfbserverTICK = setTick(async() => {});
// // ///////////  DOORS  /////////////
Doors.push({
    shortName: 'FrontLeft',
    hashId: 1504256620,
    hashName: 'v_ilev_ra_door4l',
    zone: 471,
    coords: [1395.920, 1142.904, 114.700],
    textCoords: [1395.920, 1142.904, 114.700],
    lockState: false,
    lockHeading: 0,
    canUseRank: 2,  
    distance: 1.5,
    textsize: 0.4
})
Doors.push({
    shortName: 'FrontRight',
    hashId: 262671971,
    hashName: 'v_ilev_ra_door4r',
    zone: 471,
    coords: [1395.919, 1140.704, 114.790],
    textCoords: [1395.919, 1140.704, 114.790],
    lockState: false,
    lockHeading: 0,
    canUseRank: 2,  
    distance: 1.5,
    textsize: 0.4
})
Doors.push({
    shortName: 'SouthMeetingLeft',
    hashId: -1032171637,
    hashName: 'v_ilev_ra_door1_l',
    zone: 471,
    coords: [1408.157, 1158.956, 114.487],
    textCoords: [1408.157, 1158.956, 114.487],
    lockState: false,
    lockHeading: 0,
    canUseRank: 1,  
    distance: 1.5,
    textsize: 0.4
})
Doors.push({
    shortName: 'SouthMeetingRight',
    hashId: -52575179,
    hashName: 'v_ilev_ra_door1_r',
    zone: 471,
    coords: [1408.167, 1161.155, 114.487],
    textCoords: [1408.167, 1161.155, 114.487],
    lockState: false,
    lockHeading: 0,
    canUseRank: 1, 
    distance: 1.5,
    textsize: 0.4
})
Doors.push({
    shortName: 'NorthMeetingLeft',
    hashId: -1032171637,
    hashName: 'v_ilev_ra_door1_l',
    zone: 471,
    coords: [1408.171, 1163.633, 114.487],
    textCoords: [1408.171, 1163.633, 114.487],
    lockState: false,
    lockHeading: 0,
    canUseRank: 1, 
    distance: 1.5,
    textsize: 0.4
})
Doors.push({
    shortName: 'NorthMeetingRight',
    hashId: -52575179,
    hashName: 'v_ilev_ra_door1_r',
    zone: 471,
    coords: [1408.166, 1165.834, 114.487],
    textCoords: [1408.166, 1165.834, 114.487],
    lockState: false,
    lockHeading: 0,
    canUseRank: 1, 
    distance: 1.5,
    textsize: 0.4
})
Doors.push({
    shortName: 'BossDoorLeft',
    hashId: -1032171637,
    hashName: 'v_ilev_ra_door1_l',
    zone: 471,
    coords: [1390.411, 1161.241, 114.487],
    textCoords: [1390.411, 1161.241, 114.487],
    lockState: false,
    lockHeading: 0,
    canUseRank: 2, 
    distance: 1.5,
    textsize: 0.4
})
Doors.push({
    shortName: 'BossDoorRight',
    hashId: -52575179,
    hashName: 'v_ilev_ra_door1_r',
    zone: 471,
    coords: [1390.424, 1163.438, 114.487],
    textCoords: [1390.424, 1163.438, 114.487],
    lockState: false,
    lockHeading: 0,
    canUseRank: 2, 
    distance: 1.5,
    textsize: 0.4
})
Doors.push({
    shortName: 'SWLoungeLeft',
    hashId: -1032171637,
    hashName: 'v_ilev_ra_door1_l',
    zone: 471,
    coords: [1390.666, 1131.117, 114.481],
    textCoords: [1390.666, 1131.117, 114.481],
    lockState: false,
    lockHeading: 0,
    canUseRank: 2, 
    distance: 1.5,
    textsize: 0.4
})
Doors.push({
    shortName: 'SWLoungeRight',
    hashId: -52575179,
    hashName: 'v_ilev_ra_door1_r',
    zone: 471,
    coords: [1390.666, 1133.317, 114.481],
    textCoords: [1390.666, 1133.317, 114.481],
    lockState: false,
    lockHeading: 0,
    canUseRank: 2, 
    distance: 1.5,
    textsize: 0.4
})
Doors.push({
    shortName: 'SouthLoungeLeft',
    hashId: -1032171637,
    hashName: 'v_ilev_ra_door1_l',
    zone: 471,
    coords: [1401.59, 1128.314, 114.484],
    textCoords: [1401.59, 1128.314, 114.484],
    lockState: false,
    lockHeading: 0,
    canUseRank: 2, 
    distance: 1.5,
    textsize: 0.4
})
Doors.push({
    shortName: 'SouthLoungeRight',
    hashId: -52575179,
    hashName: 'v_ilev_ra_door1_r',
    zone: 471,
    coords: [1399.393, 1128.314, 114.484],
    textCoords: [1399.393, 1128.314, 114.484],
    lockState: false,
    lockHeading: 0,
    canUseRank: 2, 
    distance: 1.5,
    textsize: 0.4
})
Doors.push({
    shortName: 'EastDiningLeft',
    hashId: -1032171637,
    hashName: 'v_ilev_ra_door1_l',
    zone: 471,
    coords: [1409.292, 1146.254, 114.487],
    textCoords: [1409.292, 1146.254, 114.487],
    lockState: false,
    lockHeading: 0,
    canUseRank: 2, 
    distance: 1.5,
    textsize: 0.4
})
Doors.push({
    shortName: 'EastDiningRight',
    hashId: -52575179,
    hashName: 'v_ilev_ra_door1_r',
    zone: 471,
    coords: [1409.292, 1148.454, 114.487],
    textCoords: [1409.292, 1148.454, 114.487],
    lockState: false,
    lockHeading: 0,
    canUseRank: 2, 
    distance: 1.5,
    textsize: 0.4
})
Doors.push({
    shortName: 'Basement stairs',
    hashId: 262671971,
    hashName: 'v_ilev_ra_door4r',
    zone: 471,
    coords: [1407.547, 1128.329, 114.485],
    textCoords: [1407.547, 1128.329, 114.485],
    lockState: false,
    lockHeading: 0,
    canUseRank: 0, 
    distance: 1.5,
    textsize: 0.4
})
Doors.push({
    shortName: 'BackGateLeft',
    hashId: 11038584,
    hashName: 'prop_lrggate_05a',
    zone: 471,
    coords: [1428.581, 1143.117, 114.369],
    textCoords: [1428.581, 1143.117, 114.369],
    lockState: false,
    lockHeading: 0,
    canUseRank: 0, 
    distance: 1.5,
    textsize: 0.4
})
Doors.push({
    shortName: 'BackGateRight',
    hashId: 11038584,
    hashName: 'prop_lrggate_05a',
    zone: 471,
    coords: [1428.581, 1140.663, 114.369],
    textCoords: [1428.581, 1140.663, 114.369],
    lockState: false,
    lockHeading: 0,
    canUseRank: 0, 
    distance: 1.5,
    textsize: 0.4
})
Doors.push({
    shortName: 'InteriorBathroom',
    hashId: 736699661,
    hashName: 'v_ilev_ra_door2',
    zone: 471,
    coords: [1397.957, 1157.569, 114.483],
    textCoords: [1397.957, 1157.569, 114.483],
    lockState: false,
    lockHeading: 0,
    canUseRank: 0, 
    distance: 1.5,
    textsize: 0.4
})
Doors.push({
    shortName: 'InteriorMeetingroom',
    hashId: 736699661,
    hashName: 'v_ilev_ra_door2',
    zone: 471,
    coords: [1400.996, 1158.951, 114.483],
    textCoords: [1400.996, 1158.951, 114.483],
    lockState: false,
    lockHeading: 0,
    canUseRank: 2, 
    distance: 1.5,
    textsize: 0.4
})
Doors.push({
    shortName: 'InteriorBossroom',
    hashId: 736699661,
    hashName: 'v_ilev_ra_door2',
    zone: 471,
    coords: [1397.062, 1164.74, 114.483],
    textCoords: [1397.062, 1164.74, 114.483],
    lockState: false,
    lockHeading: 0,
    canUseRank: 2, 
    distance: 1.5,
    textsize: 0.4
})
Doors.push({
    shortName: 'InteriorStorageroom',
    hashId: 736699661,
    hashName: 'v_ilev_ra_door2',
    zone: 471,
    coords: [1403.478, 1157.983, 114.483],
    textCoords: [1403.478, 1157.983, 114.483],
    lockState: false,
    lockHeading: 0,
    canUseRank: 1, 
    distance: 1.5,
    textsize: 0.4
})
/// downstairs
Doors.push({
    shortName: 'InterrogationRoom',
    hashId: -2023754432,
    hashName: 'v_ilev_rc_door2',
    zone: 471,
    coords: [1397.719, 1132.472, 109.893],
    textCoords: [1397.719, 1132.472, 109.893],
    lockState: false,
    lockHeading: 0,
    canUseRank: 1, 
    distance: 1.5,
    textsize: 0.4
})
Doors.push({
    shortName: 'Workshop',
    hashId: -2023754432,
    hashName: 'v_ilev_rc_door2',
    zone: 471,
    coords: [1400.046, 1136.129, 109.893],
    textCoords: [1400.046, 1136.129, 109.893],
    lockState: false,
    lockHeading: 0,
    canUseRank: 0, 
    distance: 1.5,
    textsize: 0.4
})
Doors.push({
    shortName: 'DrugProduction',
    hashId: -2023754432,
    hashName: 'v_ilev_rc_door2',
    zone: 471,
    coords: [1396.688, 1133.331, 109.893],
    textCoords: [1396.688, 1133.331, 109.893],
    lockState: false,
    lockHeading: 0,
    canUseRank: 1, 
    distance: 1.5,
    textsize: 0.4
})
Doors.push({
    shortName: 'ChemicalRoom',
    hashId: -2023754432,
    hashName: 'v_ilev_rc_door2',
    zone: 471,
    coords: [1399.016, 1143.144, 109.893],
    textCoords: [1399.016, 1143.144, 109.893],
    lockState: false,
    lockHeading: 0,
    canUseRank: 1, 
    distance: 1.5,
    textsize: 0.4
})