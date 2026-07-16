# Supabase JS Cheat Sheet (supabase-js v2, TypeScript)

## Setup

```ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types/database"; // generated types

const supabase = createClient<Database>(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
);
```

Generate types: `npx supabase gen types typescript --project-id <id> > src/types/database.ts`

---

## SELECT

```ts
// All columns
const { data, error } = await supabase.from("tasks").select("*");

// Specific columns
await supabase.from("tasks").select("id, title, status");

// Rename columns in the result
await supabase.from("tasks").select("taskId:id, taskName:title");

// Count only (no rows)
const { count } = await supabase.from("tasks").select("*", { count: "exact", head: true });

// Rows + count together
const { data, count } = await supabase.from("tasks").select("*", { count: "exact" });
```

### Single row

```ts
// Errors if 0 or >1 rows
await supabase.from("tasks").select("*").eq("id", 42).single();

// Returns null if 0 rows (no error) — usually what you want
await supabase.from("tasks").select("*").eq("id", 42).maybeSingle();
```

### Joins / embedded resources (foreign keys)

```ts
// One-to-many: task -> comments
await supabase.from("tasks").select("id, title, comments(id, body)");

// Many-to-one: task -> assigned user
await supabase.from("tasks").select("id, title, users(name, email)");

// Nested deeper
await supabase.from("tasks").select("*, comments(*, users(name))");

// Inner join (only tasks that HAVE comments)
await supabase.from("tasks").select("*, comments!inner(*)");

// Filter on the joined table
await supabase.from("tasks").select("*, comments!inner(*)").eq("comments.approved", true);

// Disambiguate when two FKs point at the same table
await supabase
    .from("tasks")
    .select(
        "*, author:users!tasks_author_id_fkey(name), assignee:users!tasks_assignee_id_fkey(name)",
    );
```

---

## FILTERS

```ts
.eq('status', 'open')          // equals
.neq('status', 'done')         // not equals
.gt('priority', 3)             // greater than
.gte('priority', 3)            // greater than or equal
.lt('created_at', '2026-01-01')
.lte('priority', 5)
.like('title', '%truck%')      // case-sensitive pattern
.ilike('title', '%truck%')     // case-insensitive pattern
.is('deleted_at', null)        // IS NULL (use for null/true/false)
.in('status', ['open', 'in_progress'])
.contains('tags', ['urgent'])  // array/jsonb contains
.containedBy('tags', ['a','b','c'])
.overlaps('tags', ['x', 'y'])  // arrays share any element
.textSearch('title', 'brake & pad')  // full-text search
```

### Chaining = AND

```ts
await supabase.from("tasks").select("*").eq("status", "open").gte("priority", 3); // status = open AND priority >= 3
```

### OR

```ts
// Comma-separated conditions, PostgREST syntax: column.operator.value
await supabase.from("tasks").select("*").or("status.eq.open,priority.gte.5");

// AND (a) with OR (b or c)
await supabase
    .from("tasks")
    .select("*")
    .eq("archived", false)
    .or("status.eq.open,status.eq.in_progress");
```

### NOT

```ts
.not('status', 'eq', 'done')
.not('tags', 'cs', '{urgent}')   // not contains
```

### JSON columns

```ts
.eq('metadata->>source', 'mobile')   // ->> returns text
.gt('metadata->stats->count', 10)
```

---

## ORDER / LIMIT / PAGINATION

```ts
await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false })
    .order("priority", { ascending: true, nullsFirst: false })
    .limit(20);

// Pagination — range is INCLUSIVE, zero-based
const page = 2,
    pageSize = 20;
const from = (page - 1) * pageSize; // 20
const to = from + pageSize - 1; // 39
await supabase.from("tasks").select("*", { count: "exact" }).range(from, to);

// Order within an embedded resource
await supabase
    .from("tasks")
    .select("*, comments(*)")
    .order("created_at", { referencedTable: "comments", ascending: false });
```

---

## INSERT

```ts
// Single row — returns nothing by default
await supabase.from("tasks").insert({ title: "Fix brakes", status: "open" });

// Return the inserted row(s): add .select()
const { data } = await supabase.from("tasks").insert({ title: "Fix brakes" }).select().single();

// Bulk insert
await supabase.from("tasks").insert([{ title: "Task A" }, { title: "Task B" }]);
```

## UPSERT

```ts
// Conflict on primary key by default
await supabase.from("tasks").upsert({ id: 42, title: "Updated title" });

// Conflict on a different unique column
await supabase.from("settings").upsert({ user_id: uid, theme: "dark" }, { onConflict: "user_id" });

// Ignore duplicates instead of updating
await supabase.from("tags").upsert(rows, { onConflict: "name", ignoreDuplicates: true });
```

## UPDATE

```ts
// ALWAYS include a filter — no filter = updates blocked by default
const { data } = await supabase
    .from("tasks")
    .update({ status: "done", completed_at: new Date().toISOString() })
    .eq("id", 42)
    .select();
```

## DELETE

```ts
await supabase.from("tasks").delete().eq("id", 42);

// Delete many
await supabase.from("tasks").delete().in("id", [1, 2, 3]);
```

---

## RPC (call Postgres functions)

```ts
const { data, error } = await supabase.rpc("get_overdue_tasks", {
    cutoff_date: "2026-07-01",
});

// You can filter RPC results too (if the function returns a table)
await supabase.rpc("get_overdue_tasks", { cutoff_date: d }).eq("status", "open").limit(10);
```

---

## AUTH (quick reference)

```ts
await supabase.auth.signUp({ email, password });
await supabase.auth.signInWithPassword({ email, password });
await supabase.auth.signOut();

const {
    data: { user },
} = await supabase.auth.getUser(); // validates with server
const {
    data: { session },
} = await supabase.auth.getSession(); // local, fast

// Listen for changes (put in your AuthProvider)
const {
    data: { subscription },
} = supabase.auth.onAuthStateChange((event, session) => {
    // 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | ...
});
subscription.unsubscribe();
```

---

## REALTIME

```ts
const channel = supabase
    .channel("tasks-changes")
    .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks", filter: "status=eq.open" },
        (payload) => console.log(payload.eventType, payload.new, payload.old),
    )
    .subscribe();

supabase.removeChannel(channel);
```

---

## STORAGE

```ts
await supabase.storage.from("avatars").upload(`public/${file.name}`, file, { upsert: true });
const { data } = supabase.storage.from("avatars").getPublicUrl("public/photo.png");
await supabase.storage.from("avatars").createSignedUrl("private/doc.pdf", 3600);
await supabase.storage.from("avatars").remove(["public/photo.png"]);
```

---

## ERROR HANDLING PATTERN

```ts
const { data, error } = await supabase.from("tasks").select("*");
if (error) throw error; // works well inside TanStack Query queryFn
return data; // data is typed, never undefined after the throw

// TanStack Query example
useQuery({
    queryKey: ["tasks", { status }],
    queryFn: async () => {
        const { data, error } = await supabase.from("tasks").select("*").eq("status", status);
        if (error) throw error;
        return data;
    },
});
```

## GOTCHAS

- `.select()` after insert/update/upsert is required if you want the row back.
- `.range(from, to)` is **inclusive** on both ends.
- Use `.is('col', null)` not `.eq('col', null)` for NULL checks.
- `.single()` throws on 0 rows; prefer `.maybeSingle()` for lookups.
- RLS silently filters rows — an "empty result" is often a policy issue, not a query bug.
- Filters on embedded tables don't exclude parent rows unless you use `!inner`.
- Default row limit is 1000 per request; paginate for more.
