::: mermaid

	sequenceDiagram

		participant User
		participant API
		participant BusinessLogic
		participant Persistence


		User ->> API: request Create_User
		API -->> User: Return Success | Faillure (201 | 403)

		API ->> BusinessLogic: call Create user functions
		BusinessLogic -->> API: check attributes (Success | Error)

		BusinessLogic ->> Persistence: Save in DataBase UserAccount (if not exists)
		Persistence --> BusinessLogic: Return Success | Faillure

	note right of API: the API sends requests to the business logic
    note right of Persistence: the persistence saves the data if it doesn't exist

:::
