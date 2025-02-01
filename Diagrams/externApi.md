``` mermaid

sequenceDiagram
    participant User
    participant API
    participant BusinessLogic
    participant Persistence
    participant ExternalAPI

	User ->> API: Request Repairability Index
    API -->> User: Return Success | Failure (200 | 400)

    API ->> BusinessLogic: Call Deal_model
    BusinessLogic -->> API: Check attributes (Success | Error)

    Api ->> ExternalAPI: Request Repairability Index from External API
    ExternalAPI -->> Api: Return Repairability Index (Success | Error)


    BusinessLogic ->> Persistence: Save Repairability Index in Database (if not exists)
    Persistence --> BusinessLogic: Return Success | Failure

    note right of API: The API sends requests to the external API and then to the business logic
    note left of Persistence: The persistence saves the repairability index if it doesn't exist
    note right of ExternalAPI: The external API provides the repairability index data

```
