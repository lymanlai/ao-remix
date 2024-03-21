--Example:
function Prompt()
  return "Lyman@aos[" .. #Inbox .. "] ($" .. CRED.balance .. ")> "
end

Handlers.add(
  "pingpong",
  Handlers.utils.hasMatchingData("ping"),
  Handlers.utils.reply("pong")
)
