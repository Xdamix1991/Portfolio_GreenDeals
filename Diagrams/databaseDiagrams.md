``` mermaid
erDiagram

	USER {
		string id PK
		string firstname
		string lastname
		string email(unique)
		string password
		date created_at
		date updated_at

	}

    DEAL {
        string id PK
        string link
        string description
        float price
        string location
        float reparability
        string user_id FK
        date created_at
        date updated_at
    }

    COMMENT {
        string id PK
        string comment
        string user_id FK
        string deal_id FK
        date created_at
    }

    VOTE {
        string id PK
        int vote_price
        int vote_eco
        string user_id FK
        string deal_id FK
    }

    USER ||--o{ DEAL : creates
    USER ||--o{ COMMENT : writes
    USER ||--o{ VOTE : votes
    DEAL ||--o{ COMMENT : has
    DEAL ||--o{ VOTE : receives

```
