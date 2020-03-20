allowedtouse = {
"license:f06fe6e7c685e3c2c26f369094238b4dfd75615f" -- we move to licenses since some vanilla server don't use steam! go figure!!
}
--
RegisterServerEvent('ODLFB:updateState')
AddEventHandler('ODLFB:updateState', function(doorID, state)
        local license 
        ids = GetPlayerIdentifiers(source)
        for i,theIdentifier in ipairs(ids) do
            if string.find(theIdentifier,"license:") or -1 > -1 then
                license = theIdentifier
            end
        end
        if license ~= nil then
            local canuse = false
            for i=1, #allowedtouse do
                if allowedtouse[i] == license then
                    canuse = true
                end
            end
            if canuse then
                -- make each door a table, and clean it when toggled
                lockState[doorID] = {}
                -- assign information
                lockState[doorID].state = state
                lockState[doorID].doorID = doorID
                TriggerClientEvent('OD:state', -1, doorID, state)
            end
        end
end)