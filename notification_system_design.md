# Stage 1 - Notification API Design

For the notification system, I would create the following APIs:

### Get Notifications

```http
GET /notifications
```

This API returns all notifications for a student. It can also support filters like unread notifications or notification type.

Example:

```http
GET /notifications?studentId=1042&isRead=false
```

### Create Notification

```http
POST /notifications
```

Used by the admin to send notifications.

Request:

```json
{
  "title": "Exam Schedule",
  "message": "Exam timetable has been released",
  "type": "ACADEMIC"
}
```

### Mark Notification as Read

```http
PATCH /notifications/{id}/read
```

Updates the notification status when a student reads it.

### Real-Time Updates

Instead of continuously checking the server, WebSockets can be used so that students receive notifications instantly.

---

# Stage 2 - Database Design

I would use PostgreSQL because the data is structured and relationships are important.

### Tables

**students**

* student_id
* name
* email

**notifications**

* notification_id
* title
* message
* type
* created_at

**student_notifications**

* student_id
* notification_id
* is_read
* delivered_at

This design avoids storing the same notification multiple times.

### Indexes

Useful indexes:

```sql
CREATE INDEX idx_student_read
ON student_notifications(student_id,is_read);
```

```sql
CREATE INDEX idx_created_at
ON notifications(created_at DESC);
```

These indexes help in fetching unread notifications quickly.

---

# Stage 3 - Query Optimization

Query:

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt DESC;
```

This query can become slow when the table grows.

I would create the following index:

```sql
CREATE INDEX idx_student_read_created
ON notifications(studentID,isRead,createdAt DESC);
```

This helps PostgreSQL filter and sort using the same index.

I would also avoid using `SELECT *` and only fetch the required columns.

---

# Stage 4 - Handling High Database Load

If every student refreshes notifications frequently, database load can increase significantly.

Possible improvements:

### Redis Cache

Store frequently accessed data such as unread notification counts.

Example:

```text
unread:1042 -> 5
```

### Pagination

Instead of loading all notifications:

```sql
LIMIT 20
```

This reduces response size.

### WebSockets

Push notifications directly to students instead of polling every few seconds.

### Read Replicas

Use replicas for read operations while keeping writes on the primary database.

These changes improve performance and reduce database load.

---

# Stage 5 - Delivering Notifications to 50,000 Students

Sending notifications one by one from the API server is not efficient.

I would use a queue-based approach.

Flow:

Admin
→ Notification API
→ Message Queue
→ Worker Processes
→ Students

Possible queue systems:

* RabbitMQ
* Kafka
* AWS SQS

Workers can process notifications in parallel and improve throughput.

### Retry Mechanism

If notification delivery fails, retry a few times before marking it as failed.

### Dead Letter Queue

Messages that repeatedly fail can be moved to a separate queue for investigation.

This makes the system more reliable and prevents message loss.

# Stage 6 - Priority Inbox

To display the most important unread notifications, I assigned a priority score to each notification.

Priority weights:

- Placement = 3
- Result = 2
- Event = 1

A recency factor is also added so that newer notifications appear higher in the inbox.

Score = Priority Weight + Recency Factor

After calculating scores for all notifications, they are sorted in descending order and the top 10 notifications are displayed.

To efficiently maintain the top 10 when new notifications arrive continuously, a Min Heap of size 10 can be used.

Process:
1. Calculate score for incoming notification.
2. If heap size is less than 10, insert it.
3. Otherwise compare with the minimum element.
4. If the new score is higher, replace the minimum element.

This approach keeps the top notifications updated with O(log n) insertion time and avoids sorting the entire notification list repeatedly.