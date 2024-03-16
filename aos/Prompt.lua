--Example:
function Prompt()
  return "Lyman@aos[" .. #Inbox .. "] > "
end

Handlers.add(
  "pingpong",
  Handlers.utils.hasMatchingData("ping"),
  Handlers.utils.reply("pong")
)
