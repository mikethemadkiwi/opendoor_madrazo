# opendoor_madrazo  
[![Developer](https://img.shields.io/badge/Developer-WiPAFiveM-BADA55)](https://whatisprojectawesome.com)  
[![Developer](https://img.shields.io/github/repo-size/mikethemadkiwi/opendoor_madrazo)](https://github.com/mikethemadkiwi/opendoor_madrazo/releases/latest)  


A Map / Interior / Door Lock System for "La Fuente Blanca Ranch" for FiveM Servers  
This script is a rewrite of a mod i wrote a while back for use in mafia roleplay.  
I updated it with a new map, and a less heavy on cpu resource.  
enjoy!  
  
### Content
1. MLO La Fuente Blanca Remodel, including meeting room, office, and basement criminal activities.  
2. FiveM Server and Client Scripts to control all doors related to the La Fuente Blanca Ranch.  
  
### Commands  
*/add_lfbkey TargetId TargetRank*  
>adds player "TargetID" as permission "TargetRank"(0-2) to the keys list  
example ( /add_lfbkey 1 2 )   

*/del_lfbkey TargetId*  
>removes player "TargetID" from the keys list  
example ( /del_lfbkey 1 )  
  
*/reload_keys*  
>Force reloads the keys from file. 

###### Note: Commands can ONLY be run from the Rcon.  
  
### USAGE  
1. place the folder into "resources"  
2. put "_ensure opendoor_madrazo_" in the server.cfg below your dependancies.
3. put "_add_ace resource.opendoor_madrazo command allow_" in your server config as well.  
4. restart your server.  
5. Right Click your mouse on doors you wish to Lock/Unlock  
6. Smile Massively.

### Video  
PLACEHOLDER VIDEO - NOT RECORDED YET!!  
[Youtube Video - La Fuente Blanca](https://www.youtube.com/watch?v=QNyRdL9qnAs)  
  
###### Note: delete ALL other mods that alter "La Fuente Blanca Ranch" mapfiles.    
Shouts to AusDOJ. the FiveM server this was made for!  
