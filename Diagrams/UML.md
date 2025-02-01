# diagram
``` mermaid


graph TD

    %% Presentation Layer
    subgraph "User Interface"
        UI[Web Interface]
        REQUESTS[JavaScript Client Scripts]
        EXTERNAL_API[External APIs]
    end

    %% API Layer
    subgraph "API Layer - Python Flask"
        API[Flask REST API]
        ROUTES[Flask Routes]
    end

    %% Business Logic Layer
    subgraph "Business Logic - python"
        User[Users Model]
        Deal[Deals Model]
        Comments[Comments Model]
        VotePrice[Votes/Price Model]
    end

    %% Data Layer
    subgraph "Database"
        DB[(SQLite + SQLAlchemy)]
    end

    %% Simple relationships
    UI --> |HTTP/AJAX| REQUESTS
    REQUESTS --> |HTTP| EXTERNAL_API
    REQUESTS --> |API calls| API
    EXTERNAL_API --> API

    API --> ROUTES
    ROUTES --> User
    ROUTES --> Deal
    ROUTES --> Comments
    ROUTES --> VotePrice

    User & Deal & Comments & VotePrice --> |ORM| DB

    style API fill:#4CAF50,color:#fff
    style DB fill:#F29111,color:#fff
    style REQUESTS fill:#F7DF1E,color:#000

```
