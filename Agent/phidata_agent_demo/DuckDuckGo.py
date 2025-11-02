from phi.agent import Agent
from phi.model.google import Gemini
from phi.tools.duckduckgo import DuckDuckGo


# Set your Gemini API key here
gemini_api_key = "AIzaSyAsNNDIILxBmvaxMSnP08PomtRC0r0zrLQ"  # Replace with your actual Gemini API key

web_agent = Agent(
    name="Web Search Agent",
    model=Gemini(
        id="gemini-1.5-flash",
        api_key=gemini_api_key  # Pass the API key directly to the Gemini model
    ),
tools=[DuckDuckGo()]    ,
    show_tool_calls=True,
    markdown=True,
)

web_agent.print_response("Whats happening in Pakistan?", stream=True)
