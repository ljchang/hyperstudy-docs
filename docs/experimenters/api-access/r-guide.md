---
id: r-guide
title: R Guide
slug: /experimenters/api-access/r-guide
sidebar_position: 6
---

# R Guide for HyperStudy API

This guide provides complete, working examples for accessing HyperStudy data using R.

## Prerequisites

### Installation

Install required packages:

```r
install.packages(c("httr", "jsonlite", "dplyr", "tidyr", "readr"))
```

### API Key Setup

Create a `.Renviron` file in your project directory:

```bash
# .Renviron
HYPERSTUDY_API_KEY=hst_live_your_api_key_here
HYPERSTUDY_BASE_URL=https://api.hyperstudy.io/api/v3
```

Load environment variables in R:

```r
# At the start of your script
readRenviron(".Renviron")

API_KEY <- Sys.getenv("HYPERSTUDY_API_KEY")
BASE_URL <- Sys.getenv("HYPERSTUDY_BASE_URL")
```

## Quick Start

### Minimal Example

```r
library(httr)
library(jsonlite)

# Load API key
API_KEY <- Sys.getenv("HYPERSTUDY_API_KEY")
BASE_URL <- Sys.getenv("HYPERSTUDY_BASE_URL")

# Make your first request
response <- GET(
  paste0(BASE_URL, "/data/events/room/your-room-id"),
  add_headers("X-API-Key" = API_KEY),
  query = list(limit = 10)
)

# Check if successful
if (status_code(response) == 200) {
  result <- content(response, as = "parsed")
  events <- result$data

  message(sprintf("Retrieved %d events", length(events)))

  # Print first few events
  for (event in events[1:min(5, length(events))]) {
    message(sprintf("%dms: %s", event$onset, event$componentType))
  }
} else {
  message(sprintf("Error: %d - %s", status_code(response), content(response, as = "text")))
}
```

## Complete Examples

### Example 1: Download Events for One Participant

**Goal**: Fetch all events for a specific participant in a session.

```r
library(httr)
library(jsonlite)
library(dplyr)

#' Download all events for a participant in a specific session
#'
#' @param api_key Your HyperStudy API key
#' @param participant_id Participant's ID
#' @param room_id Room/session ID
#' @return Data frame of events
download_participant_events <- function(api_key, participant_id, room_id) {
  base_url <- "https://api.hyperstudy.io/api/v3"

  # Make API request
  response <- GET(
    paste0(base_url, "/data/events/participant/", participant_id),
    add_headers("X-API-Key" = api_key),
    query = list(
      roomId = room_id,
      sort = "onset",
      order = "asc"
    )
  )

  # Check for errors
  if (!http_error(response)) {
    result <- content(response, as = "parsed")

    # Check API status
    if (result$status == "success") {
      events <- result$data
      metadata <- result$metadata

      message(sprintf("Retrieved %d events", length(events)))
      message(sprintf("Experiment started at: %s",
                     metadata$processing$experimentStartedAt))
      message(sprintf("Total events available: %d",
                     metadata$pagination$total))

      # Convert to data frame
      if (length(events) > 0) {
        df <- bind_rows(lapply(events, function(x) {
          # Flatten nested structures
          as.data.frame(lapply(x, function(y) {
            if (is.list(y) && length(y) > 0) {
              return(toJSON(y, auto_unbox = TRUE))
            }
            return(y)
          }), stringsAsFactors = FALSE)
        }))

        # Add computed columns
        df$onset_sec <- df$onset / 1000

        # Parse timestamps
        df$timestamp <- as.POSIXct(df$timestamp,
                                   format = "%Y-%m-%dT%H:%M:%OS",
                                   tz = "UTC")

        return(df)
      }
    } else {
      message(sprintf("API Error: %s", result$error$message))
    }
  } else {
    message(sprintf("HTTP Error: %d - %s",
                   status_code(response),
                   content(response, as = "text")))
  }

  return(data.frame())
}

# Usage
readRenviron(".Renviron")

events_df <- download_participant_events(
  api_key = Sys.getenv("HYPERSTUDY_API_KEY"),
  participant_id = "your-participant-id",
  room_id = "your-room-id"
)

# Analyze events
if (nrow(events_df) > 0) {
  message("\nFirst 5 events:")
  print(events_df %>%
    select(onset_sec, componentType, content) %>%
    head(5))

  message("\nSummary:")
  message(sprintf("  Total events: %d", nrow(events_df)))
  message(sprintf("  Component types: %d", n_distinct(events_df$componentType)))
  message(sprintf("  Duration: %.1f seconds",
                 max(events_df$onset_sec) - min(events_df$onset_sec)))
}
```

### Example 2: Download All Data Types

**Goal**: Fetch events, recordings, chat, and ratings for comprehensive analysis.

```r
library(httr)
library(jsonlite)
library(dplyr)

#' Download all data types for a participant
#'
#' @param api_key Your HyperStudy API key
#' @param participant_id Participant's ID
#' @param room_id Room/session ID
#' @return List with all data types
download_all_participant_data <- function(api_key, participant_id, room_id) {
  base_url <- "https://api.hyperstudy.io/api/v3"
  headers <- add_headers("X-API-Key" = api_key)
  query_params <- list(roomId = room_id)

  data_types <- list(
    events = "events",
    recordings = "recordings",
    chat = "chat",
    continuous_ratings = "ratings/continuous",
    sync_metrics = "sync"
  )

  all_data <- list()

  message(sprintf("Downloading data for participant %s...", participant_id))

  for (key in names(data_types)) {
    endpoint <- data_types[[key]]
    url <- paste0(base_url, "/data/", endpoint, "/participant/", participant_id)

    response <- tryCatch({
      GET(url, headers, query = query_params, timeout(30))
    }, error = function(e) {
      message(sprintf("  ✗ %s: Request failed - %s", key, e$message))
      return(NULL)
    })

    if (!is.null(response) && !http_error(response)) {
      result <- content(response, as = "parsed")
      all_data[[key]] <- result$data
      message(sprintf("  ✓ %s: %d records", key, length(result$data)))
    } else {
      message(sprintf("  ✗ %s: Error %d", key,
                     ifelse(is.null(response), "NA", status_code(response))))
      all_data[[key]] <- list()
    }
  }

  message("\nDownload complete!")
  return(all_data)
}

# Usage
readRenviron(".Renviron")

all_data <- download_all_participant_data(
  api_key = Sys.getenv("HYPERSTUDY_API_KEY"),
  participant_id = "your-participant-id",
  room_id = "your-room-id"
)

# Summary
message("\nData Summary:")
for (data_type in names(all_data)) {
  records <- all_data[[data_type]]
  if (length(records) > 0) {
    message(sprintf("  %s: %d records", data_type, length(records)))
  }
}
```

### Example 3: Export to CSV and Analyze with dplyr

**Goal**: Download events, convert to data frame, analyze, and export to CSV.

```r
library(httr)
library(jsonlite)
library(dplyr)
library(tidyr)

#' Download events and export to CSV
#'
#' @param api_key Your HyperStudy API key
#' @param room_id Room/session ID
#' @param output_file Path to output CSV file
export_events_to_csv <- function(api_key, room_id, output_file) {
  base_url <- "https://api.hyperstudy.io/api/v3"

  message(sprintf("Fetching events for room %s...", room_id))

  response <- GET(
    paste0(base_url, "/data/events/room/", room_id),
    add_headers("X-API-Key" = api_key),
    query = list(sort = "onset", order = "asc")
  )

  if (http_error(response)) {
    message(sprintf("Error: %d - %s",
                   status_code(response),
                   content(response, as = "text")))
    return(NULL)
  }

  result <- content(response, as = "parsed")
  events <- result$data

  message(sprintf("Retrieved %d events", length(events)))

  # Convert to data frame
  df <- bind_rows(lapply(events, function(x) {
    # Handle nested structures
    as.data.frame(lapply(x, function(y) {
      if (is.list(y) && length(y) > 0) {
        return(toJSON(y, auto_unbox = TRUE))
      }
      return(y)
    }), stringsAsFactors = FALSE)
  }))

  # Add computed columns
  df <- df %>%
    mutate(
      onset_sec = onset / 1000,
      timestamp = as.POSIXct(timestamp,
                            format = "%Y-%m-%dT%H:%M:%OS",
                            tz = "UTC")
    )

  # Export to CSV
  write.csv(df, output_file, row.names = FALSE)
  message(sprintf("Exported to %s", output_file))

  # Display summary statistics
  message("\nSummary Statistics:")
  message(sprintf("  Total events: %d", nrow(df)))
  message(sprintf("  Unique participants: %d",
                 n_distinct(df$participantId)))
  message(sprintf("  Component types: %d",
                 n_distinct(df$componentType)))
  message(sprintf("  Time range: %.1fs - %.1fs",
                 min(df$onset_sec), max(df$onset_sec)))

  # Show component type distribution
  message("\nEvents by Component Type:")
  component_summary <- df %>%
    count(componentType, sort = TRUE) %>%
    head(10)
  print(component_summary)

  return(df)
}

# Usage
readRenviron(".Renviron")

timestamp <- format(Sys.time(), "%Y%m%d_%H%M%S")
output_file <- sprintf("events_%s.csv", timestamp)

events_df <- export_events_to_csv(
  api_key = Sys.getenv("HYPERSTUDY_API_KEY"),
  room_id = "your-room-id",
  output_file = output_file
)

# Further analysis with dplyr
if (!is.null(events_df)) {
  # Filter to specific component types
  video_events <- events_df %>%
    filter(componentType == "ShowVideo")

  message(sprintf("\nVideo events: %d", nrow(video_events)))

  # Group by participant
  by_participant <- events_df %>%
    group_by(participantId) %>%
    summarize(
      event_count = n(),
      duration_sec = max(onset_sec) - min(onset_sec),
      .groups = "drop"
    )

  message("\nEvents per participant:")
  print(by_participant)
}
```

### Example 4: Download with Pagination

**Goal**: Download all events for an experiment using pagination for large datasets.

```r
library(httr)
library(jsonlite)
library(dplyr)

#' Download all events for an experiment using pagination
#'
#' @param api_key Your HyperStudy API key
#' @param experiment_id Experiment ID
#' @return Data frame with all events
download_experiment_all_pages <- function(api_key, experiment_id) {
  base_url <- "https://api.hyperstudy.io/api/v3"
  headers <- add_headers("X-API-Key" = api_key)

  all_events <- list()
  offset <- 0
  limit <- 1000
  has_more <- TRUE

  message(sprintf("Downloading all events for experiment %s...", experiment_id))

  while (has_more) {
    # Make request with pagination
    response <- GET(
      paste0(base_url, "/data/events/experiment/", experiment_id),
      headers,
      query = list(
        limit = limit,
        offset = offset,
        sort = "onset",
        order = "asc"
      ),
      timeout(60)
    )

    if (http_error(response)) {
      message(sprintf("Error: %d - %s",
                     status_code(response),
                     content(response, as = "text")))
      break
    }

    result <- content(response, as = "parsed")

    # Add events from this page
    page_events <- result$data
    all_events <- c(all_events, page_events)

    # Check pagination
    pagination <- result$metadata$pagination
    total <- pagination$total
    has_more <- pagination$hasMore

    message(sprintf("  Downloaded %d/%d events (%.1f%%)",
                   length(all_events),
                   total,
                   length(all_events) / total * 100))

    # Update offset for next page
    if (has_more) {
      offset <- pagination$nextOffset
      if (is.null(offset)) {
        offset <- offset + limit
      }
    } else {
      message("  All pages downloaded!")
    }
  }

  message(sprintf("\nTotal: %d events downloaded", length(all_events)))

  # Convert to data frame
  if (length(all_events) > 0) {
    df <- bind_rows(lapply(all_events, function(x) {
      as.data.frame(lapply(x, function(y) {
        if (is.list(y) && length(y) > 0) {
          return(toJSON(y, auto_unbox = TRUE))
        }
        return(y)
      }), stringsAsFactors = FALSE)
    }))

    df$onset_sec <- df$onset / 1000
    return(df)
  }

  return(data.frame())
}

# Usage
readRenviron(".Renviron")

all_events_df <- download_experiment_all_pages(
  api_key = Sys.getenv("HYPERSTUDY_API_KEY"),
  experiment_id = "your-experiment-id"
)

# Analyze complete dataset
if (nrow(all_events_df) > 0) {
  message("\nDataset Summary:")
  message(sprintf("  Total events: %d", nrow(all_events_df)))
  message(sprintf("  Participants: %d",
                 n_distinct(all_events_df$participantId)))
  message(sprintf("  Sessions: %d",
                 n_distinct(all_events_df$sessionId)))
  message(sprintf("  Duration: %.1f seconds",
                 max(all_events_df$onset_sec)))

  # Save to CSV
  output_file <- sprintf("experiment_%s_all_events.csv", experiment_id)
  write.csv(all_events_df, output_file, row.names = FALSE)
  message(sprintf("\nSaved to %s", output_file))
}
```

## Reusable Client Class (R6)

For production use, create a reusable R6 client class:

```r
library(R6)
library(httr)
library(jsonlite)

HyperStudyClient <- R6Class(
  "HyperStudyClient",

  public = list(
    api_key = NULL,
    base_url = NULL,

    initialize = function(api_key,
                         base_url = "https://api.hyperstudy.io/api/v3") {
      self$api_key <- api_key
      self$base_url <- base_url
    },

    get_events = function(scope, scope_id, ...) {
      self$request(sprintf("data/events/%s/%s", scope, scope_id), ...)
    },

    get_recordings = function(scope, scope_id, ...) {
      self$request(sprintf("data/recordings/%s/%s", scope, scope_id), ...)
    },

    get_all_participant_data = function(participant_id, room_id) {
      list(
        events = self$get_events("participant", participant_id, roomId = room_id),
        recordings = self$get_recordings("participant", participant_id, roomId = room_id)
      )
    },

    to_dataframe = function(data) {
      df <- bind_rows(lapply(data, function(x) {
        as.data.frame(lapply(x, function(y) {
          if (is.list(y)) return(toJSON(y, auto_unbox = TRUE))
          return(y)
        }), stringsAsFactors = FALSE)
      }))

      if ("onset" %in% names(df)) {
        df$onset_sec <- df$onset / 1000
      }

      return(df)
    },

    request = function(endpoint, ...) {
      url <- paste0(self$base_url, "/", endpoint)
      headers <- add_headers("X-API-Key" = self$api_key)

      response <- GET(url, headers, query = list(...), timeout(30))

      if (!http_error(response)) {
        result <- content(response, as = "parsed")
        if (result$status == "success") {
          return(result$data)
        }
      }

      return(NULL)
    }
  )
)

# Usage
readRenviron(".Renviron")
client <- HyperStudyClient$new(api_key = Sys.getenv("HYPERSTUDY_API_KEY"))

# Fetch and analyze
events <- client$get_events("room", "your-room-id")
df <- client$to_dataframe(events)
summary(df)
```

## Error Handling

### Robust Error Handling Pattern

```r
make_robust_request <- function(url, headers, query = list(), max_retries = 3) {
  for (attempt in 1:max_retries) {
    response <- tryCatch({
      GET(url, headers, query = query, timeout(30))
    }, error = function(e) {
      message(sprintf("Attempt %d failed: %s", attempt, e$message))
      return(NULL)
    })

    if (!is.null(response)) {
      # Check for rate limiting
      if (status_code(response) == 429) {
        retry_after <- as.numeric(headers(response)$`Retry-After`)
        if (is.na(retry_after)) retry_after <- 60
        message(sprintf("Rate limited. Waiting %ds...", retry_after))
        Sys.sleep(retry_after)
        next
      }

      if (!http_error(response)) {
        result <- content(response, as = "parsed")

        if (result$status == "error") {
          message(sprintf("API Error [%s]: %s",
                         result$error$code,
                         result$error$message))
          return(NULL)
        }

        return(result)
      }
    }

    # Exponential backoff
    if (attempt < max_retries) {
      wait_time <- 2^(attempt - 1)
      message(sprintf("Waiting %ds before retry...", wait_time))
      Sys.sleep(wait_time)
    }
  }

  message("Max retries exceeded")
  return(NULL)
}
```

## Troubleshooting

### Common Issues

**Package installation errors**:
```r
# If packages won't install, try:
install.packages(c("httr", "jsonlite"), dependencies = TRUE)
```

**Environment variable not found**:
```r
# Check .Renviron file exists
file.exists(".Renviron")

# Reload environment
readRenviron(".Renviron")

# Check value
Sys.getenv("HYPERSTUDY_API_KEY")
```

**JSON parsing errors**:
```r
# If JSON parsing fails, try:
result <- content(response, as = "text")
parsed <- fromJSON(result, simplifyDataFrame = TRUE)
```

**Data frame conversion issues**:
```r
# For complex nested structures, manually flatten:
df <- do.call(rbind, lapply(events, function(x) {
  data.frame(
    id = x$id,
    onset = x$onset,
    componentType = x$componentType,
    stringsAsFactors = FALSE
  )
}))
```

## Next Steps

- **Learn about other languages**: [Python](./python-guide.md) | [JavaScript](./javascript-guide.md)
- **Understand all endpoints**: [Data Types & Endpoints](./data-types.md)
- **Manage your keys**: [API Key Management](./api-keys.md)
