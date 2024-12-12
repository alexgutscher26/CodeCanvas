import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    language: v.optional(v.string()),
    framework: v.optional(v.string()),
    difficulty: v.optional(v.union(v.literal("BEGINNER"), v.literal("INTERMEDIATE"), v.literal("ADVANCED"), v.literal("EXPERT"))),
    search: v.optional(v.string()),
    sortBy: v.optional(
      v.union(
        v.literal("newest"),
        v.literal("popular"),
      )
    ),
  },
  handler: async (ctx, args) => {
    let templates = await ctx.db
      .query("marketplaceTemplates")
      .collect();

    // Filter by language if provided
    if (args.language) {
      templates = templates.filter((t) => t.language.toLowerCase() === args.language?.toLowerCase());
    }

    // Filter by framework if provided
    if (args.framework) {
      templates = templates.filter((t) => t.framework.toLowerCase() === args.framework?.toLowerCase());
    }

    // Filter by difficulty if provided
    if (args.difficulty) {
      templates = templates.filter((t) => t.difficulty === args.difficulty);
    }

    if (args.search) {
      const searchLower = args.search.toLowerCase();
      templates = templates.filter(
        (t) =>
          t.title.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower)
      );
    }

    if (args.sortBy) {
      switch (args.sortBy) {
        case "newest":
          templates.sort((a, b) => b.createdAt - a.createdAt);
          break;
        case "popular":
          templates.sort((a, b) => b.downloads - a.downloads);
          break;
      }
    }

    return templates;
  },
});

export const get = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const template = await ctx.db
      .query("marketplaceTemplates")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .first();

    if (!template) {
      return null;
    }

    return template;
  },
});

export const purchase = mutation({
  args: {
    templateId: v.id("marketplaceTemplates"),
    transactionId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    // Increment downloads count
    const template = await ctx.db.get(args.templateId);
    if (!template) {
      throw new Error("Template not found");
    }

    await ctx.db.patch(args.templateId, {
      downloads: (template.downloads || 0) + 1,
    });

    return template;
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
    userName: v.string(),
    name: v.string(),
    description: v.string(),
    language: v.string(),
    framework: v.string(),
    difficulty: v.union(v.literal("BEGINNER"), v.literal("INTERMEDIATE"), v.literal("ADVANCED"), v.literal("EXPERT")),
    code: v.string(),
    isPro: v.boolean(),
  },
  handler: async (ctx, args) => {
    const templateId = await ctx.db.insert("marketplaceTemplates", {
      userId: args.userId,
      userName: args.userName,
      title: args.name,
      description: args.description,
      language: args.language,
      framework: args.framework,
      difficulty: args.difficulty,
      code: args.code,
      isPro: args.isPro,
      downloads: 0,
      complexity: 1.0,
      tags: [],
      version: "1.0.0",
      previewImage: "", // We'll need to add image upload functionality later
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return templateId;
  },
});

export const createTemplates = mutation({
  args: {},
  handler: async (ctx) => {
    const templates = [
      {
        userId: "system",
        title: "Next.js 15 Authentication with Clerk",
        description: "A complete authentication setup using Clerk in Next.js 15 App Router. Includes protected routes, user profile, and middleware configuration.",
        code: `// middleware.ts
import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
  publicRoutes: ["/", "/api/webhook/clerk"],
});
 
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}`,
        language: "typescript",
        framework: "next.js",
        previewImage: "/templates/auth.jpg",
        price: 29.99,
        downloads: 245,
        userName: "CodeCraft Team",
        difficulty: "BEGINNER" as const,
        complexity: 2.0,
        tags: ["next.js", "auth", "clerk", "middleware"],
        version: "1.0.0",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isPro: false
      },
      {
        userId: "system",
        title: "Next.js 15 Server Actions Form",
        description: "A complete form implementation using Next.js 15 Server Actions. Includes client and server-side validation, error handling, and TypeScript types.",
        code: `"use client"
 
import { useFormState } from "react-dom"
import { SubmitButton } from "@/components/submit-button"
 
const initialState = {
  message: null,
  errors: {},
}
 
export default function ProfileForm() {
  const [state, formAction] = useFormState(updateProfile, initialState)
 
  return (
    <form action={formAction}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full border rounded-lg p-2"
        />
        {state.errors?.name && (
          <div className="text-red-500">{state.errors.name}</div>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full border rounded-lg p-2"
        />
        {state.errors?.email && (
          <div className="text-red-500">{state.errors.email}</div>
        )}
      </div>

      <div>
        <label htmlFor="age">Age</label>
        <input
          id="age"
          name="age"
          type="number"
          required
          className="w-full border rounded-lg p-2"
        />
        {state.errors?.age && (
          <div className="text-red-500">{state.errors.age}</div>
        )}
      </div>

      <SubmitButton />

      {state.message && (
        <div className="mt-4 p-4 rounded-lg bg-slate-100">
          {state.message}
        </div>
      )}
    </form>
  )
}`,
        language: "typescript",
        framework: "next.js",
        previewImage: "/templates/server-actions.jpg",
        price: 44.99,
        downloads: 178,
        userName: "CodeCraft Team",
        difficulty: "ADVANCED" as const,
        complexity: 4.5,
        tags: ["next.js", "server-actions", "forms", "validation"],
        version: "1.0.0",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isPro: true
      },
      {
        userId: "system",
        title: "React Query Data Fetching Pattern",
        description: "A robust data fetching pattern using React Query with TypeScript. Includes error handling, loading states, and optimistic updates.",
        code: `// types/api.ts
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

// hooks/useTodos.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export function useTodos() {
  const queryClient = useQueryClient();

  const todosQuery = useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: async () => {
      const { data } = await axios.get('/api/todos');
      return data;
    },
  });

  const addTodoMutation = useMutation({
    mutationFn: (newTodo: Omit<Todo, 'id'>) =>
      axios.post('/api/todos', newTodo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: (updatedTodo: Todo) =>
      axios.put(\`/api/todos/\${updatedTodo.id}\`, updatedTodo),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['todos'], (old: Todo[] | undefined) =>
        old?.map((todo) =>
          todo.id === variables.id ? variables : todo
        )
      );
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: (todoId: number) =>
      axios.delete(\`/api/todos/\${todoId}\`),
    onSuccess: (_, todoId) => {
      queryClient.setQueryData(['todos'], (old: Todo[] | undefined) =>
        old?.filter((todo) => todo.id !== todoId)
      );
    },
  });

  return {
    todos: todosQuery.data ?? [],
    isLoading: todosQuery.isLoading,
    isError: todosQuery.isError,
    error: todosQuery.error,
    addTodo: addTodoMutation.mutate,
    updateTodo: updateTodoMutation.mutate,
    deleteTodo: deleteTodoMutation.mutate,
  };
}

// components/TodoList.tsx
import { useTodos } from '../hooks/useTodos';

export function TodoList() {
  const {
    todos,
    isLoading,
    isError,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
  } = useTodos();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      {todos.map((todo) => (
        <div key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() =>
              updateTodo({ ...todo, completed: !todo.completed })
            }
          />
          <span>{todo.title}</span>
          <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}`,
        language: "typescript",
        framework: "react",
        previewImage: "/templates/react-query.jpg",
        price: 39.99,
        downloads: 234,
        userName: "CodeCraft Team",
        difficulty: "ADVANCED" as const,
        complexity: 4.2,
        tags: ["react-query", "typescript", "data-fetching", "hooks"],
        version: "1.0.0",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isPro: true
      },
      {
        userId: "system",
        title: "Next.js Server Actions Form Pattern",
        description: "A type-safe form handling pattern using Next.js 15 Server Actions with client-side validation and error handling.",
        code: `// lib/validations.ts
import { z } from "zod";

export const UserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  age: z.number().min(13).max(120),
});

export type UserFormData = z.infer<typeof UserSchema>;

// lib/actions.ts
'use server'

import { revalidatePath } from "next/cache";
import { UserSchema, type UserFormData } from "./validations";

export async function createUser(formData: FormData) {
  const validatedFields = UserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    age: Number(formData.get("age")),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid fields",
    };
  }

  try {
    // Add to database
    await db.user.create({
      data: validatedFields.data,
    });

    revalidatePath("/users");
    return { message: "User created successfully" };
  } catch (error) {
    return {
      message: "Database Error: Failed to create user.",
    };
  }
}

// components/UserForm.tsx
'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { createUser } from '@/lib/actions'

const initialState = {
  message: null,
  errors: {},
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
    >
      {pending ? 'Creating...' : 'Create User'}
    </button>
  )
}

export function UserForm() {
  const [state, formAction] = useFormState(createUser, initialState)

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full border rounded-lg p-2"
        />
        {state.errors?.name && (
          <div className="text-red-500">{state.errors.name}</div>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full border rounded-lg p-2"
        />
        {state.errors?.email && (
          <div className="text-red-500">{state.errors.email}</div>
        )}
      </div>

      <div>
        <label htmlFor="age">Age</label>
        <input
          id="age"
          name="age"
          type="number"
          required
          className="w-full border rounded-lg p-2"
        />
        {state.errors?.age && (
          <div className="text-red-500">{state.errors.age}</div>
        )}
      </div>

      <SubmitButton />

      {state.message && (
        <div className="mt-4 p-4 rounded-lg bg-slate-100">
          {state.message}
        </div>
      )}
    </form>
  )
}`,
        language: "typescript",
        framework: "next.js",
        previewImage: "/templates/server-actions.jpg",
        price: 44.99,
        downloads: 178,
        userName: "CodeCraft Team",
        difficulty: "ADVANCED" as const,
        complexity: 4.5,
        tags: ["next.js", "server-actions", "forms", "validation"],
        version: "1.0.0",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isPro: true
      }
    ];

    for (const template of templates) {
      await ctx.db.insert("marketplaceTemplates", template);
    }

    return { success: true, count: templates.length };
  },
});
