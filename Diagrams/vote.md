``` mermaid

	sequenceDiagram
		participant User
		participant API
		participant BusinessLogic
		participant Persistence

		User ->> API: Request Vote
		API -->> User: Return Success | Failure (200 | 400)

		API ->> BusinessLogic: Call Vote function
		BusinessLogic -->> API: Check attributes (Success | Error)

		BusinessLogic ->> Persistence: Save Vote in Database (if not exists)
		Persistence --> BusinessLogic: Return Success | Failure

		note right of API: The API sends requests to the business logic
		note right of Persistence: The persistence saves the vote if it doesn't exist

```
