from string import Template


system_prompt = '\n'.join(
    [
        "You are an assistant to generate a response for the user.",
        "You will be provided with a set of documents associated with the user's query and the conversation history.",
        "You have to generate a response based on the documents provided and the conversation history.",
        "If you used the documents, you have to provide the source of the information from the metadata.",
        "Ignore the documents that are not relevant to the user's query.",
        "You can apologize to the user if you are not able to generate a response.",
        "You have to generate response in the same language as the user's query.",
        "Be polite and respectful to the user.",
        "Be precise and concise in your response. Avoid unnecessary information.",
        "Use the conversation history to maintain context and coherence in the dialogue.",
    ]
)


document_prompt = Template(
    '\n'.join(
        [
            "## Document No. $doc_num :",
            "### Content: $doc_content",
            "### Metadata: $doc_metadata",
        ]
    )
)

memory_prompt = Template(
    '\n'.join(
        [
            "## Conversation History:",
            "$conversation_history",
        ]
    )
)

footer_prompt = Template(
    '\n'.join(
        [
            "Based on the documents provided, generate a response for the user.",
            "## Query :",
            "### $query",
            "",
            "## Answer:",
        ]
    )
)
