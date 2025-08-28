-- Grant admin role to specific user
INSERT INTO public.user_roles (user_id, role)
VALUES ('57ddb2df-524c-4656-9201-a15ac1372cef', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;