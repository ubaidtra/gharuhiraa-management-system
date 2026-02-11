import { supabase } from './supabase';

console.warn('⚠️  lib/prisma.ts is deprecated. Please update routes to use supabase from @/lib/supabase');

export const prisma = {
  user: {
    findUnique: async (args: any) => {
      const { where } = args;
      if (where?.username) {
        const { data, error } = await supabase
          .from('User')
          .select('*')
          .eq('username', where.username)
          .single();
        if (error) throw error;
        return data;
      }
      if (where?.id) {
        const { data, error } = await supabase
          .from('User')
          .select('*')
          .eq('id', where.id)
          .single();
        if (error) throw error;
        return data;
      }
      return null;
    },
    findMany: async (args?: any) => {
      let query = supabase.from('User').select('*');
      if (args?.orderBy) {
        const field = Object.keys(args.orderBy)[0];
        const direction = args.orderBy[field] === 'desc' ? false : true;
        query = query.order(field, { ascending: direction });
      }
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    count: async (args?: any) => {
      let query = supabase.from('User').select('*', { count: 'exact', head: true });
      if (args?.where) {
        Object.keys(args.where).forEach(key => {
          query = query.eq(key, args.where[key]);
        });
      }
      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    },
    create: async (args: any) => {
      const { data, error } = await supabase
        .from('User')
        .insert(args.data)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    update: async (args: any) => {
      const { where, data } = args;
      const { data: result, error } = await supabase
        .from('User')
        .update(data)
        .eq('id', where.id)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    delete: async (args: any) => {
      const { where } = args;
      const { error } = await supabase
        .from('User')
        .delete()
        .eq('id', where.id);
      if (error) throw error;
      return { id: where.id };
    },
    deleteMany: async (args?: any) => {
      let query = supabase.from('User').delete();
      if (args?.where) {
        Object.keys(args.where).forEach(key => {
          query = query.eq(key, args.where[key]);
        });
      }
      const { error } = await query;
      if (error) throw error;
      return { count: 0 };
    },
  },
  student: {
    findUnique: async (args: any) => {
      const { where } = args;
      if (where?.id) {
        const { data, error } = await supabase
          .from('Student')
          .select('*')
          .eq('id', where.id)
          .single();
        if (error) throw error;
        return data;
      }
      return null;
    },
    findMany: async (args?: any) => {
      let query = supabase.from('Student').select('*');
      if (args?.where) {
        Object.keys(args.where).forEach(key => {
          query = query.eq(key, args.where[key]);
        });
      }
      if (args?.include) {
        if (args.include.halaqa) {
          query = query.select('*, Halaqa (*)');
        }
      }
      if (args?.orderBy) {
        const field = Object.keys(args.orderBy)[0];
        const direction = args.orderBy[field] === 'desc' ? false : true;
        query = query.order(field, { ascending: direction });
      }
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    count: async (args?: any) => {
      let query = supabase.from('Student').select('*', { count: 'exact', head: true });
      if (args?.where) {
        Object.keys(args.where).forEach(key => {
          query = query.eq(key, args.where[key]);
        });
      }
      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    },
    create: async (args: any) => {
      const { data, error } = await supabase
        .from('Student')
        .insert(args.data)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    update: async (args: any) => {
      const { where, data } = args;
      const { data: result, error } = await supabase
        .from('Student')
        .update(data)
        .eq('id', where.id)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    delete: async (args: any) => {
      const { where } = args;
      const { error } = await supabase
        .from('Student')
        .delete()
        .eq('id', where.id);
      if (error) throw error;
      return { id: where.id };
    },
  },
  teacher: {
    findUnique: async (args: any) => {
      const { where } = args;
      if (where?.id) {
        const { data, error } = await supabase
          .from('Teacher')
          .select('*')
          .eq('id', where.id)
          .single();
        if (error) throw error;
        return data;
      }
      return null;
    },
    findMany: async (args?: any) => {
      let query = supabase.from('Teacher').select('*');
      if (args?.include) {
        if (args.include.halaqas) {
          query = query.select('*, Halaqa (*)');
        }
      }
      if (args?.orderBy) {
        const field = Object.keys(args.orderBy)[0];
        const direction = args.orderBy[field] === 'desc' ? false : true;
        query = query.order(field, { ascending: direction });
      }
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    count: async (args?: any) => {
      let query = supabase.from('Teacher').select('*', { count: 'exact', head: true });
      if (args?.where) {
        Object.keys(args.where).forEach(key => {
          query = query.eq(key, args.where[key]);
        });
      }
      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    },
    create: async (args: any) => {
      const { data, error } = await supabase
        .from('Teacher')
        .insert(args.data)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    update: async (args: any) => {
      const { where, data } = args;
      const { data: result, error } = await supabase
        .from('Teacher')
        .update(data)
        .eq('id', where.id)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    delete: async (args: any) => {
      const { where } = args;
      const { error } = await supabase
        .from('Teacher')
        .delete()
        .eq('id', where.id);
      if (error) throw error;
      return { id: where.id };
    },
  },
  halaqa: {
    findUnique: async (args: any) => {
      const { where } = args;
      if (where?.id) {
        const { data, error } = await supabase
          .from('Halaqa')
          .select('*')
          .eq('id', where.id)
          .single();
        if (error) throw error;
        return data;
      }
      return null;
    },
    findMany: async (args?: any) => {
      let query = supabase.from('Halaqa').select('*');
      if (args?.where) {
        Object.keys(args.where).forEach(key => {
          query = query.eq(key, args.where[key]);
        });
      }
      if (args?.include) {
        if (args.include.teacher) {
          query = query.select('*, Teacher (*)');
        }
        if (args.include.students) {
          query = query.select('*, Student (*)');
        }
      }
      if (args?.orderBy) {
        const field = Object.keys(args.orderBy)[0];
        const direction = args.orderBy[field] === 'desc' ? false : true;
        query = query.order(field, { ascending: direction });
      }
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    count: async (args?: any) => {
      let query = supabase.from('Halaqa').select('*', { count: 'exact', head: true });
      if (args?.where) {
        Object.keys(args.where).forEach(key => {
          query = query.eq(key, args.where[key]);
        });
      }
      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    },
    create: async (args: any) => {
      const { data, error } = await supabase
        .from('Halaqa')
        .insert(args.data)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    update: async (args: any) => {
      const { where, data } = args;
      const { data: result, error } = await supabase
        .from('Halaqa')
        .update(data)
        .eq('id', where.id)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    delete: async (args: any) => {
      const { where } = args;
      const { error } = await supabase
        .from('Halaqa')
        .delete()
        .eq('id', where.id);
      if (error) throw error;
      return { id: where.id };
    },
  },
  transaction: {
    findMany: async (args?: any) => {
      let query = supabase.from('Transaction').select('*');
      if (args?.where) {
        Object.keys(args.where).forEach(key => {
          query = query.eq(key, args.where[key]);
        });
      }
      if (args?.include) {
        if (args.include.student) {
          query = query.select('*, Student (*)');
        }
      }
      if (args?.orderBy) {
        const field = Object.keys(args.orderBy)[0];
        const direction = args.orderBy[field] === 'desc' ? false : true;
        query = query.order(field, { ascending: direction });
      }
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    create: async (args: any) => {
      const { data, error } = await supabase
        .from('Transaction')
        .insert(args.data)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  },
  learningRecord: {
    findMany: async (args?: any) => {
      let query = supabase.from('LearningRecord').select('*');
      if (args?.where) {
        Object.keys(args.where).forEach(key => {
          query = query.eq(key, args.where[key]);
        });
      }
      if (args?.orderBy) {
        const field = Object.keys(args.orderBy)[0];
        const direction = args.orderBy[field] === 'desc' ? false : true;
        query = query.order(field, { ascending: direction });
      }
      if (args?.take) {
        query = query.limit(args.take);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    create: async (args: any) => {
      const { data, error } = await supabase
        .from('LearningRecord')
        .insert(args.data)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  },
  report: {
    findMany: async (args?: any) => {
      let query = supabase.from('Report').select('*');
      if (args?.where) {
        Object.keys(args.where).forEach(key => {
          query = query.eq(key, args.where[key]);
        });
      }
      if (args?.include) {
        if (args.include.teacher) {
          query = query.select('*, Teacher (*)');
        }
      }
      if (args?.orderBy) {
        const field = Object.keys(args.orderBy)[0];
        const direction = args.orderBy[field] === 'desc' ? false : true;
        query = query.order(field, { ascending: direction });
      }
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    create: async (args: any) => {
      const { data, error } = await supabase
        .from('Report')
        .insert(args.data)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    delete: async (args: any) => {
      const { where } = args;
      const { error } = await supabase
        .from('Report')
        .delete()
        .eq('id', where.id);
      if (error) throw error;
      return { id: where.id };
    },
  },
};
